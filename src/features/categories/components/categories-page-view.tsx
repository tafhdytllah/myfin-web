"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CategoriesFiltersCard } from "@/features/categories/components/categories-filters-card";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { CategoriesSummaryCards } from "@/features/categories/components/categories-summary-cards";
import { CategoryStatusDialog } from "@/features/categories/components/category-status-dialog";
import { CategoriesTableSection } from "@/features/categories/components/categories-table-section";
import { Category } from "@/features/categories/types/category-types";
import {
  useCategories,
  useToggleCategoryStatus,
} from "@/features/categories/hooks/use-category-queries";
import {
  buildCategorySearchParams,
  parseCategoryFilters,
} from "@/features/categories/utils/category-search-params";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { PageActionButton } from "@/components/shared/page-action-button";
import { ResetFiltersButton } from "@/components/shared/reset-filters-button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTranslations } from "@/lib/i18n/use-translations";

export function CategoriesPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslations();
  const filters = useMemo(
    () => parseCategoryFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const categoriesQuery = useCategories(filters);
  const toggleStatusMutation = useToggleCategoryStatus();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [statusDialogCategory, setStatusDialogCategory] = useState<Category | null>(null);
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  const debouncedKeyword = useDebouncedValue(keyword);

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const selectedTypeLabel = useMemo(() => {
    switch (filters.type) {
      case "INCOME":
        return t("common.income");
      case "EXPENSE":
        return t("common.expense");
      default:
        return t("categories.typeAll");
    }
  }, [filters.type, t]);
  const selectedStatusLabel = useMemo(() => {
    switch (filters.status) {
      case "active":
        return t("common.active");
      case "inactive":
        return t("common.inactive");
      default:
        return t("categories.statusAll");
    }
  }, [filters.status, t]);
  const modalTrail = useMemo(() => {
    if (statusDialogCategory) {
      return t("common.deactivate");
    }

    if (formOpen && editingCategory) {
      return t("common.edit");
    }

    if (formOpen) {
      return t("common.create");
    }

    return null;
  }, [editingCategory, formOpen, statusDialogCategory, t]);

  usePageTrail([modalTrail]);

  const summary = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((category) => category.active).length,
      inactive: categories.filter((category) => !category.active).length,
      income: categories.filter((category) => category.type === "INCOME").length,
      expense: categories.filter((category) => category.type === "EXPENSE").length,
    }),
    [categories],
  );
  const hasActiveFilters = Boolean(
    filters.keyword || filters.type !== "all" || filters.status !== "all",
  );

  const updateFilters = useCallback((nextFilters: typeof filters) => {
    const params = buildCategorySearchParams(nextFilters);
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    if (debouncedKeyword === (filters.keyword ?? "")) {
      return;
    }

    updateFilters({
      ...filters,
      keyword: debouncedKeyword,
    });
  }, [debouncedKeyword, filters, updateFilters]);

  function openCreateDialog() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function resetFilters() {
    setKeyword("");
    updateFilters({
      keyword: "",
      type: "all",
      status: "all",
    });
  }

  return (
    <div className="space-y-6">
      <CategoriesSummaryCards
        items={[
          { label: t("categories.total"), value: String(summary.total) },
          { label: t("common.active"), value: String(summary.active) },
          { label: t("common.inactive"), value: String(summary.inactive) },
          { label: t("common.income"), value: String(summary.income) },
          { label: t("common.expense"), value: String(summary.expense) },
        ]}
      />

      <CategoriesTableSection
        loading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
        items={categories}
        title={t("categories.title")}
        description={t("categories.description")}
        retryDescription={t("categories.loadErrorDescription")}
        retryLabel={t("categories.retry")}
        onRetry={() => categoriesQuery.refetch()}
        emptyDescription={t("categories.emptyDescription")}
        addLabel={t("categories.addCategory")}
        onAdd={openCreateDialog}
        labels={{
          columns: t("common.columns"),
          columnsMenu: t("common.columns"),
          selectedRows: (count) => t("common.selectedRows", { count }),
          totalRows: (count) => t("common.totalRows", { count }),
          selectAllRows: t("common.selectAllRows"),
          selectCategoryRow: (name) => t("common.selectCategoryRow", { name }),
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
        filters={
          <CategoriesFiltersCard
            keyword={keyword}
            searchPlaceholder={t("categories.searchPlaceholder")}
            onKeywordChange={setKeyword}
            typeValue={filters.type ?? "all"}
            typePlaceholder={t("common.type")}
            typeDisplayValue={selectedTypeLabel}
            typeOptions={[
              { value: "all", label: t("categories.typeAll") },
              { value: "INCOME", label: t("common.income") },
              { value: "EXPENSE", label: t("common.expense") },
            ]}
            onTypeChange={(value) =>
              updateFilters({
                ...filters,
                type: value as "all" | "INCOME" | "EXPENSE",
              })
            }
            statusValue={filters.status ?? "all"}
            statusPlaceholder={t("common.status")}
            statusDisplayValue={selectedStatusLabel}
            statusOptions={[
              { value: "all", label: t("categories.statusAll") },
              { value: "active", label: t("common.active") },
              { value: "inactive", label: t("common.inactive") },
            ]}
            onStatusChange={(value) =>
              updateFilters({
                ...filters,
                status: value as "all" | "active" | "inactive",
              })
            }
          />
        }
        primaryAction={
          <>
            {hasActiveFilters ? (
              <ResetFiltersButton
                label={t("categories.resetFilters")}
                onClick={resetFilters}
              />
            ) : null}
            <PageActionButton onClick={openCreateDialog}>
              {t("categories.addCategory")}
            </PageActionButton>
          </>
        }
      />

      <CategoryFormDialog
        category={editingCategory}
        open={formOpen}
        onOpenChange={setFormOpen}
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
