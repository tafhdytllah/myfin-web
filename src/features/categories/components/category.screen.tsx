"use client";

import { usePageTrail } from "@/components/layout/page-trail-context";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { PageActionButton } from "@/components/shared/page-action-button";
import { CategoryFormDialog } from "@/features/categories/components/category-form.dialog";
import { CategoryTableSection } from "@/features/categories/components/category-table.section";
import { useToggleCategoryStatus } from "@/features/categories/hooks/use-category-mutations";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { Category } from "@/features/categories/types/category.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export function CategoryScreen() {
  const { t } = useTranslations();
  const categoriesQuery = useCategories({
    keyword: "",
    type: "all",
    status: "all",
  });
  const toggleStatusMutation = useToggleCategoryStatus();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [statusDialogCategory, setStatusDialogCategory] = useState<Category | null>(null);

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const modalTrail = useMemo(() => {
    if (statusDialogCategory) {
      return t("common.deactivate");
    }

    if (isCreateOpen) {
      return t("common.create");
    }

    if (editingCategory) {
      return t("common.edit");
    }

    return null;
  }, [editingCategory, isCreateOpen, statusDialogCategory, t]);

  usePageTrail([modalTrail]);

  function openCreateDialog() {
    setEditingCategory(null);
    setIsCreateOpen(true);
  }

  function openEditDialog(category: Category) {
    setIsCreateOpen(false);
    setEditingCategory(category);
  }

  return (
    <div className="space-y-6">
      <CategoryTableSection
        loading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
        items={categories}
        onRetry={() => categoriesQuery.refetch()}
        action={
          <PageActionButton onClick={openCreateDialog}>
            <Plus className="size-4" />
            {t("categories.addCategory")}
          </PageActionButton>
        }
        activatingPending={toggleStatusMutation.isPending}
        onEdit={openEditDialog}
        onDeactivate={setStatusDialogCategory}
        onActivate={(category) =>
          toggleStatusMutation.mutate({
            id: category.id,
            payload: {
              active: true
            },
          })
        }
      />

      <CategoryFormDialog
        category={editingCategory}
        open={isCreateOpen || Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingCategory(null);
          }
        }}
      />

      <ConfirmActionDialog
        open={Boolean(statusDialogCategory)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusDialogCategory(null);
          }
        }}
        pending={toggleStatusMutation.isPending}
        title={t("categories.deactivateTitle")}
        description={
          statusDialogCategory
            ? t("categories.deactivateDescription", { name: statusDialogCategory?.name, })
            : ""
        }
        hint={t("categories.deactivateHistoryHint")}
        cancelLabel={t("categories.cancel")}
        confirmLabel={t("common.deactivate")}
        pendingLabel={t("categories.saving")}
        onConfirm={async () => {
          if (!statusDialogCategory) {
            return;
          }

          try {
            await toggleStatusMutation.mutateAsync({
              id: statusDialogCategory.id,
              payload: {
                active: false,
              }
            });

            setStatusDialogCategory(null);

          } catch {
            setStatusDialogCategory(null);
          }
        }}
      />
    </div>
  );
}
