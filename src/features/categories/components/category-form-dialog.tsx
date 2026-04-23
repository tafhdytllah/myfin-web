"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { DialogFormActions } from "@/components/shared/dialog-form-actions";
import { FormFieldItem } from "@/components/shared/form-field-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CategoryFormValues,
  createCategoryFormSchema,
} from "@/features/categories/schemas/category-form.schema";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/use-category-queries";
import { Category } from "@/features/categories/types/category-types";
import { getApiFieldError } from "@/lib/api/error-fields";
import { useTranslations } from "@/lib/i18n/use-translations";

type CategoryFormDialogProps = {
  category?: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryFormDialog({
  category,
  open,
  onOpenChange,
}: CategoryFormDialogProps) {
  const { t } = useTranslations();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isEditMode = Boolean(category);
  const schema = useMemo(() => createCategoryFormSchema(t), [t]);

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
            const nameError = getApiFieldError(error, "name");
            const typeError = getApiFieldError(error, "type");

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
          const nameError = getApiFieldError(error, "name");
          const typeError = getApiFieldError(error, "type");

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
  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <FormFieldItem
            label={t("categories.categoryName")}
            htmlFor="category-name"
            errors={[form.formState.errors.name]}
          >
            <Input
              id="category-name"
              {...form.register("name")}
              placeholder={t("categories.categoryNamePlaceholder")}
            />
          </FormFieldItem>

          <FormFieldItem label={t("common.type")} errors={[form.formState.errors.type]}>
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
          </FormFieldItem>

          <DialogFormActions
            cancelLabel={t("categories.cancel")}
            submitLabel={isEditMode ? t("common.update") : t("common.save")}
            pendingLabel={t("categories.saving")}
            isPending={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
