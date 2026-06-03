import { DataTable } from "@/components/data-table/table";
import { RetryCard } from "@/components/retry-card";
import { SectionCard } from "@/components/section-card";
import { StackSkeleton } from "@/components/stack-skeleton";
import {
  CategoryTableRow,
  useCategoryTableColumns,
} from "@/features/categories/components/category-table.columns";
import { CategoryTableToolbar } from "@/features/categories/components/category-table.toolbar";
import { CATEGORY_TYPES, CategoryListFilters } from "@/features/categories/types/category.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";

type CategoryMainSectionProps = {
  items: CategoryTableRow[];
  totalRows: number;
  isLoading: boolean;
  activatingPending: boolean;
  isError: boolean;
  filters: CategoryListFilters;
  onFiltersChange: (filters: CategoryListFilters) => void;
  onRetry: () => void;
  paginationState: PaginationState;
  onPaginationChange: Dispatch<SetStateAction<PaginationState>>;
  onEdit: (item: CategoryTableRow) => void;
  onDeactivate: (item: CategoryTableRow) => void;
  onActivate: (item: CategoryTableRow) => void;
  action?: ReactNode;
};

export function CategoryMainSection({
  items,
  totalRows,
  isLoading,
  activatingPending,
  isError,
  filters,
  onFiltersChange,
  onRetry,
  paginationState,
  onPaginationChange,
  onEdit,
  onDeactivate,
  onActivate,
  action,
}: CategoryMainSectionProps) {
  const { t } = useTranslations();

  const columns = useCategoryTableColumns({
    activatingPending,
    onEdit,
    onDeactivate,
    onActivate,
  });

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const nextFilters: ColumnFiltersState = [];

    if (filters.keyword) {
      nextFilters.push({ id: "name", value: filters.keyword });
    }

    if (filters.type && filters.type !== "all") {
      nextFilters.push({ id: "type", value: filters.type });
    }

    if (filters.status && filters.status !== "all") {
      nextFilters.push({ id: "status", value: filters.status });
    }

    return nextFilters;
  }, [filters.keyword, filters.status, filters.type]);

  function handleColumnFiltersChange(updater: SetStateAction<ColumnFiltersState>) {
    const nextColumnFilters =
      typeof updater === "function" ? updater(columnFilters) : updater;
    const getFilterValue = (id: string) =>
      nextColumnFilters.find((filter) => filter.id === id)?.value;
    const getStringValue = (value: unknown) =>
      typeof value === "string" ? value : "";
    const type = getStringValue(getFilterValue("type"));
    const status = getStringValue(getFilterValue("status"));

    onFiltersChange({
      ...filters,
      keyword: getStringValue(getFilterValue("name")),
      type: type === CATEGORY_TYPES.INCOME || type === CATEGORY_TYPES.EXPENSE ? type : "all",
      status:
        status === "active" || status === "inactive"
          ? status
          : "all",
      page: 1,
    });
  }

  if (isError) {
    return (
      <RetryCard
        title={t("categories.loadErrorTitle")}
        description={t("categories.loadErrorDescription")}
        retryLabel={t("categories.retry")}
        onRetry={onRetry}
      />
    );
  }

  return (
    <SectionCard
      title={t("categories.title")}
      description={t("categories.description")}
      action={action}
    >
      {isLoading ? (
        <StackSkeleton count={6} itemClassName="h-12 rounded-xl bg-muted" />
      ) : (
        <DataTable
          pageSize={paginationState.pageSize}
          manualPagination
          total={totalRows}
          paginationState={paginationState}
          setPaginationState={onPaginationChange}
          columns={columns}
          data={items}
          manualFiltering
          columnFilters={columnFilters}
          setColumnFilters={handleColumnFiltersChange}
          toolbar={(table) => (
            <CategoryTableToolbar
              table={table}
            />
          )}
        />
      )}
    </SectionCard>
  );
}
