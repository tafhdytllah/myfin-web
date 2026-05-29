"use client";

import { DialogFormActions } from "@/components/dialog-form-actions";
import { DialogFormHeader } from "@/components/dialog-form-header";
import { FormSection } from "@/components/form/form-section";
import { SelectField } from "@/components/inputs/select-field";
import { TextField } from "@/components/inputs/text-field";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCreateCategory, useUpdateCategory } from "@/features/categories/hooks/use-category-mutations";
import {
  CategoryFormSchema,
  createCategoryFormSchema,
} from "@/features/categories/schemas/category-form.schema";
import { Category } from "@/features/categories/types/category.types";
import { ApiError } from "@/lib/api/api-error";
import { applyApiFieldErrors } from "@/lib/errors/apply-field-errors";
import { useTranslations } from "@/lib/i18n/use-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

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
  const isEditMode = Boolean(category);
  const schema = useMemo(() => createCategoryFormSchema(t), [t]);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();


  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
    },
  });

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

  const onSubmit = async (values: CategoryFormSchema) => {
    try {
      if (category) {
        await updateMutation.mutateAsync({
          id: category.id,
          payload: {
            name: values.name,
            type: values.type,
          }
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch (error) {
      if (ApiError.isApiError(error)) {
        applyApiFieldErrors(error, ["name", "type"], form.setError);
        return;
      }
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogFormHeader
          title={isEditMode ? t("categories.editCategory") : t("categories.addCategory")}
          description={isEditMode ? t("categories.editDescription") : t("categories.createDescription")}
        />

        <FormSection onSubmit={form.handleSubmit(onSubmit)}>
          <TextField
            id="category-name"
            type="text"
            autoComplete="category-name"
            label={t("categories.categoryName")}
            placeholder={t("categories.categoryNamePlaceholder")}
            error={form.formState.errors.name?.message}
            {...form.register("name")}
            className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
          />

          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <SelectField
                label={t("common.type")}
                placeholder={t("common.type")}
                value={field.value}
                onValueChange={field.onChange}
                error={fieldState.error?.message}
                options={[
                  {
                    label: t("common.income"),
                    value: "INCOME",
                  },
                  {
                    label: t("common.expense"),
                    value: "EXPENSE",
                  },
                ]}
              />
            )}
          />

          <DialogFormActions
            cancelLabel={t("categories.cancel")}
            submitLabel={isEditMode ? t("common.update") : t("common.save")}
            pendingLabel={t("categories.saving")}
            isPending={isPending}
            onCancel={() => onOpenChange(false)}
          />
        </FormSection>
      </DialogContent>
    </Dialog>
  );
}
