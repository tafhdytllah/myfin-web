"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { usePageTrail } from "@/components/layout/page-trail-context";
import { PageActionButton } from "@/components/shared/page-action-button";
import { CategoryFormDialog } from "@/features/categories/components/form/category-form-dialog";
import { CategoryStatusDialog } from "@/features/categories/components/table/category-status-dialog";
import { CategoryTableSection } from "@/features/categories/components/table/category-table-section";
import {
  useCategories,
  useToggleCategoryStatus,
} from "@/features/categories/hooks/use-category-queries";
import { Category } from "@/features/categories/types/category-types";
import { useTranslations } from "@/lib/i18n/use-translations";

export function CategoryPageView() {
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
            category,
            active: true,
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

      <CategoryStatusDialog
        category={statusDialogCategory}
        open={Boolean(statusDialogCategory)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusDialogCategory(null);
          }
        }}
      />
    </div>
  );
}
