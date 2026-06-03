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
import {
  buildCategorySearchParams,
  parseCategoryFilters,
} from "@/features/categories/utils/category-search-params";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTranslations } from "@/lib/i18n/use-translations";
import { PaginationState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

export function CategoryPage() {
  const { t } = useTranslations();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseCategoryFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const [formOpen, setFormOpen] = useState(false);

  const [keyword, setKeyword] = useState(filters.keyword ?? "");

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [statusDialogCategory, setStatusDialogCategory] = useState<Category | null>(null);

  const debouncedKeyword = useDebouncedValue(keyword);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      keyword: debouncedKeyword,
    }),
    [debouncedKeyword, filters],
  );

  const categoriesQuery = useCategories(queryFilters);

  const toggleStatusMutation = useToggleCategoryStatus(() => {
    setStatusDialogCategory(null);
  });

  const categories = useMemo(
    () => categoriesQuery.data?.items ?? [],
    [categoriesQuery.data],
  );

  const totalRowCategories = categoriesQuery.data?.meta?.totalElements ?? categories.length;

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

  const updateFilters = useCallback((nextFilters: CategoryListFilters) => {
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

  function handleFiltersChange(nextFilters: CategoryListFilters) {
    setKeyword(nextFilters.keyword ?? "");

    if (nextFilters.type === filters.type && nextFilters.status === filters.status) {
      return;
    }

    updateFilters({
      ...nextFilters,
      keyword: filters.keyword ?? "",
    });
  }

  const paginationState = useMemo<PaginationState>(
    () => ({
      pageIndex: Math.max(filters.page - 1, 0),
      pageSize: filters.size,
    }),
    [filters.page, filters.size],
  );

  const handlePaginationChange = useCallback(
    (updater: SetStateAction<PaginationState>) => {
      const nextPagination =
        typeof updater === "function" ? updater(paginationState) : updater;

      updateFilters({
        ...filters,
        page: nextPagination.pageIndex + 1,
        size: nextPagination.pageSize,
      });
    },
    [filters, paginationState, updateFilters],
  );

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
        items={categories}
        totalRows={totalRowCategories}
        isLoading={categoriesQuery.isLoading}
        activatingPending={toggleStatusMutation.isPending}
        isError={categoriesQuery.isError}
        filters={{ ...filters, keyword }}
        onFiltersChange={handleFiltersChange}
        onRetry={() => categoriesQuery.refetch()}
        paginationState={paginationState}
        onPaginationChange={handlePaginationChange}
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
        action={
          <PageActionButton onClick={openCreateDialog}>
            <Plus className="size-4" />
            {t("categories.addCategory")}
          </PageActionButton>
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

          await toggleStatusMutation.mutateAsync({
            id: statusDialogCategory.id,
            payload: {
              active: false,
            },
          });
        }}
      />
    </div>
  );
}
