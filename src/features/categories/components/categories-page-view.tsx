"use client";

import { useMemo, useState } from "react";

import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { CategoryStatusDialog } from "@/features/categories/components/category-status-dialog";
import { CategoriesTableSection } from "@/features/categories/components/categories-table-section";
import { Category } from "@/features/categories/types/category-types";
import {
  useCategories,
  useToggleCategoryStatus,
} from "@/features/categories/hooks/use-category-queries";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { useTranslations } from "@/lib/i18n/use-translations";

export function CategoriesPageView() {
  const { t } = useTranslations();
  const categoriesQuery = useCategories({
    keyword: "",
    type: "all",
    status: "all",
  });
  const toggleStatusMutation = useToggleCategoryStatus();
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

    if (editingCategory) {
      return t("common.edit");
    }

    return null;
  }, [editingCategory, statusDialogCategory, t]);

  usePageTrail([modalTrail]);

  function openEditDialog(category: Category) {
    setEditingCategory(category);
  }

  return (
    <div className="space-y-6">
      <CategoriesTableSection
        loading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
        items={categories}
        title={t("categories.title")}
        description={t("categories.description")}
        retryTitle={t("categories.loadErrorTitle")}
        retryDescription={t("categories.loadErrorDescription")}
        retryLabel={t("categories.retry")}
        onRetry={() => categoriesQuery.refetch()}
        labels={{
          category: t("common.category"),
          type: t("common.type"),
          status: t("common.status"),
          used: t("common.used"),
          actions: t("common.actions"),
          income: t("common.income"),
          expense: t("common.expense"),
          active: t("common.active"),
          inactive: t("common.inactive"),
          edit: t("common.edit"),
          deactivate: t("common.deactivate"),
          activate: t("common.activate"),
          sortAscending: t("common.sortAscending"),
          sortDescending: t("common.sortDescending"),
          hideColumn: t("common.hideColumn"),
          selectAllRows: t("common.selectAllRows"),
          selectCategoryRow: (name) => t("common.selectCategoryRow", { name }),
          searchPlaceholder: t("categories.searchPlaceholder"),
          typePlaceholder: t("common.type"),
          statusPlaceholder: t("common.status"),
          typeAll: t("categories.typeAll"),
          statusAll: t("categories.statusAll"),
          resetFilters: t("categories.resetFilters"),
          view: t("common.view"),
          toggleColumns: t("common.toggleColumns"),
          noResults: t("common.noResults"),
          rowsSelected: (selected, total) =>
            t("common.rowsSelected", { selected, total }),
          rowsPerPage: t("common.rowsPerPage"),
          pageOf: (current, total) => t("common.pageOf", { current, total }),
          firstPage: t("common.firstPage"),
          previousPage: t("common.previousPage"),
          nextPage: t("common.nextPage"),
          lastPage: t("common.lastPage"),
        }}
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
        open={Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) {
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
