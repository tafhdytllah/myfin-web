"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/features/categories/types/category-types";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/use-category-queries";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { createValidationMessages } from "@/lib/validation/messages";

type CategoryFormDialogProps = {
  category?: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function createCategorySchema(t: ReturnType<typeof useTranslations>["t"]) {
  const validation = createValidationMessages(t);

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, validation.required(t("categories.categoryName"))),
    type: z.enum(["INCOME", "EXPENSE"], {
      error: () => validation.required(t("common.type")),
    }),
  });
}

type CategoryFormValues = z.infer<ReturnType<typeof createCategorySchema>>;

function getFieldError(error: unknown, field: string) {
  if (!(error instanceof ApiError)) {
    return undefined;
  }

  const detail = error.details?.[field];

  if (Array.isArray(detail)) {
    return detail[0];
  }

  return detail;
}

export function CategoryFormDialog({
  category,
  open,
  onOpenChange,
}: CategoryFormDialogProps) {
  const { t } = useTranslations();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isEditMode = Boolean(category);
  const schema = useMemo(() => createCategorySchema(t), [t]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
    },
  });
  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });
  const selectedTypeLabel = selectedType === "INCOME" ? t("common.income") : t("common.expense");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (category) {
      form.reset({
        name: category.name,
        type: category.type,
      });
      return;
    }

    form.reset({
      name: "",
      type: "EXPENSE",
    });
  }, [category, form, open]);

  function handleSubmit(values: CategoryFormValues) {
    if (category) {
      updateMutation.mutate(
        {
          id: category.id,
          payload: {
            name: values.name,
            type: values.type,
            active: category.active,
          },
          onSuccess: () => onOpenChange(false),
        },
        {
          onError: (error) => {
            const nameError = getFieldError(error, "name");
            const typeError = getFieldError(error, "type");

            if (nameError) {
              form.setError("name", { message: nameError });
            }

            if (typeError) {
              form.setError("type", { message: typeError });
            }
          },
        },
      );

      return;
    }

    createMutation.mutate(
      {
        payload: values,
        onSuccess: () => onOpenChange(false),
      },
      {
        onError: (error) => {
          const nameError = getFieldError(error, "name");
          const typeError = getFieldError(error, "type");

          if (nameError) {
            form.setError("name", { message: nameError });
          }

          if (typeError) {
            form.setError("type", { message: typeError });
          }
        },
      },
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t("categories.editCategory") : t("categories.addCategory")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t("categories.editDescription")
              : t("categories.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <Field>
            <FieldLabel htmlFor="category-name">{t("categories.categoryName")}</FieldLabel>
            <FieldContent>
              <Input
                id="category-name"
                {...form.register("name")}
                placeholder={t("categories.categoryNamePlaceholder")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("common.type")}</FieldLabel>
            <FieldContent>
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  form.setValue("type", value as CategoryFormValues["type"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.type")}>
                    {selectedTypeLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">{t("common.income")}</SelectItem>
                  <SelectItem value="EXPENSE">{t("common.expense")}</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[form.formState.errors.type]} />
            </FieldContent>
          </Field>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("categories.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("categories.saving")
                : isEditMode
                  ? t("common.update")
                  : t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
