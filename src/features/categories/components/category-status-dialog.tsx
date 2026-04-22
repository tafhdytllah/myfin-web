"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("categories.deactivateTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("categories.deactivateDescription", { name: category.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          {t("categories.deactivateHistoryHint")}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("categories.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              toggleMutation.mutate(
                {
                  category,
                  active: false,
                  onSuccess: () => onOpenChange(false),
                },
                {
                  onError: () => onOpenChange(false),
                },
              );
            }}
          >
            {toggleMutation.isPending ? t("categories.saving") : t("common.deactivate")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
