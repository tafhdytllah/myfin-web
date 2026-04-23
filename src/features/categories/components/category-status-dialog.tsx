"use client";

import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { Category } from "@/features/categories/types/category-types";
import { useToggleCategoryStatus } from "@/features/categories/hooks/use-category-queries";
import { useTranslations } from "@/lib/i18n/use-translations";

type CategoryStatusDialogProps = {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryStatusDialog({
  category,
  open,
  onOpenChange,
}: CategoryStatusDialogProps) {
  const { t } = useTranslations();
  const toggleMutation = useToggleCategoryStatus();

  if (!category) {
    return null;
  }

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      pending={toggleMutation.isPending}
      title={t("categories.deactivateTitle")}
      description={t("categories.deactivateDescription", { name: category.name })}
      hint={t("categories.deactivateHistoryHint")}
      cancelLabel={t("categories.cancel")}
      confirmLabel={t("common.deactivate")}
      pendingLabel={t("categories.saving")}
      onConfirm={() =>
        toggleMutation.mutate(
          {
            category,
            active: false,
            onSuccess: () => onOpenChange(false),
          },
          {
            onError: () => onOpenChange(false),
          },
        )
      }
    />
  );
}
