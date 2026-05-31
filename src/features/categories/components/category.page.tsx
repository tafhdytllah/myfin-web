"use client";

import { ConfirmActionDialog } from "@/components/confirm-action-dialog";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { PageActionButton } from "@/components/page-action-button";
import { CategoryFormDialog } from "@/features/categories/components/category-form.dialog";
import { CategoryMainSection } from "@/features/categories/components/category-main.section";
import { useToggleCategoryStatus } from "@/features/categories/hooks/use-category-mutations";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import {
  Category,
  CategoryListFilters,
} from "@/features/categories/types/category.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTranslations } from "@/lib/i18n/use-translations";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export function CategoryPage() {
  const { t } = useTranslations();

  const [filters, setFilters] = useState<CategoryListFilters>({
    keyword: "",
    type: "all",
    status: "all",
  });

  const [formOpen, setFormOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [statusDialogCategory, setStatusDialogCategory] = useState<Category | null>(null);

  const debouncedKeyword = useDebouncedValue(filters.keyword ?? "");

  const queryFilters = useMemo(
    () => ({
      ...filters,
      keyword: debouncedKeyword,
    }),
    [debouncedKeyword, filters],
  );

  const categoriesQuery = useCategories(queryFilters);

  const toggleStatusMutation = useToggleCategoryStatus();

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const modalTrail = useMemo(() => {
    if (statusDialogCategory) {
      return t("common.deactivate");
    }

    if (formOpen) {
      return t("common.create");
    }

    if (editingCategory) {
      return t("common.edit");
    }

    return null;
  }, [editingCategory, formOpen, statusDialogCategory, t]);

  usePageTrail([modalTrail]);

  function openCreateDialog() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditDialog(category: Category) {
    setFormOpen(false);
    setEditingCategory(category);
  }

  return (
    <div className="space-y-6">

      <CategoryMainSection
        loading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
        items={categories}
        onRetry={() => categoriesQuery.refetch()}
        filters={filters}
        onFiltersChange={setFilters}
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
        open={formOpen || Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
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
