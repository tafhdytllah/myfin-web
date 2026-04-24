"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { DialogFormActions } from "@/components/shared/dialog-form-actions";
import { DialogFormHeader } from "@/components/shared/dialog-form-header";
import { FormLayout } from "@/components/shared/form-layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CategoryNameField } from "@/features/categories/components/category-name-field";
import { CategoryTypeField } from "@/features/categories/components/category-type-field";
import {
  CategoryFormValues,
  createCategoryFormSchema,
} from "@/features/categories/schemas/category-form.schema";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/use-category-queries";
import { Category } from "@/features/categories/types/category-types";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
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
            applyApiFieldErrors(error, ["name", "type"], form.setError);
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
          applyApiFieldErrors(error, ["name", "type"], form.setError);
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
        <DialogFormHeader
          title={
            isEditMode ? t("categories.editCategory") : t("categories.addCategory")
          }
          description={
            isEditMode
              ? t("categories.editDescription")
              : t("categories.createDescription")
          }
        />

        <FormLayout onSubmit={form.handleSubmit(handleSubmit)}>
          <CategoryNameField
            error={form.formState.errors.name?.message}
            registration={form.register("name")}
          />

          <CategoryTypeField
            error={form.formState.errors.type?.message}
            value={selectedType}
            onValueChange={(value) =>
              form.setValue("type", (value ?? "EXPENSE") as CategoryFormValues["type"], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />

          <DialogFormActions
            cancelLabel={t("categories.cancel")}
            submitLabel={isEditMode ? t("common.update") : t("common.save")}
            pendingLabel={t("categories.saving")}
            isPending={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </FormLayout>
      </DialogContent>
    </Dialog>
  );
}
