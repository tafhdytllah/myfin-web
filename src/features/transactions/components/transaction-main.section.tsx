import { DataTable } from "@/components/data-table/table";
import { RetryCard } from "@/components/retry-card";
import { SectionCard } from "@/components/section-card";
import { StackSkeleton } from "@/components/stack-skeleton";
import { Account } from "@/features/accounts/types/account.types";
import { Category, CATEGORY_TYPES, CategoryType } from "@/features/categories/types/category.types";
import {
  TransactionTableRow,
  useTransactionTableColumns
} from "@/features/transactions/components/transaction-table.columns";
import { TransactionTableToolbar } from "@/features/transactions/components/transaction-table.toolbar";
import { TransactionListFilters } from "@/features/transactions/types/transaction.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import {
  ColumnFiltersState,
  PaginationState
} from "@tanstack/react-table";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";

type TransactionMainSectionProps = {
  accounts: Account[];
  categories: Category[];
  items: TransactionTableRow[];
  totalRows: number;
  isLoading: boolean;
  isError: boolean;
  filters: TransactionListFilters;
  onFiltersChange: (filters: TransactionListFilters) => void;
  onRetry: () => void;
  paginationState: PaginationState;
  onPaginationChange: Dispatch<SetStateAction<PaginationState>>;
  onEdit: (row: TransactionTableRow) => void;
  onDelete: (row: TransactionTableRow) => void;
  action?: ReactNode;
  formatDate: (value: string) => string;
  formatCurrency: (value: number) => string;
};

export function TransactionMainSection({
  accounts,
  categories,
  items,
  totalRows,
  isLoading,
  isError,
  filters,
  onFiltersChange,
  onRetry,
  paginationState,
  onPaginationChange,
  onEdit,
  onDelete,
  action,
  formatDate,
  formatCurrency,
}: TransactionMainSectionProps) {
  const { t } = useTranslations();

  const columns = useTransactionTableColumns({
    formatCurrency,
    formatDate,
    onEdit,
    onDelete,
  });

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const nextFilters: ColumnFiltersState = [];

    if (filters.keyword) {
      nextFilters.push({ id: "description", value: filters.keyword });
    }

    if (filters.accountId) {
      nextFilters.push({ id: "accountId", value: filters.accountId });
    }

    if (filters.type && filters.type !== "all") {
      nextFilters.push({ id: "type", value: filters.type });
    }

    if (filters.categoryId) {
      nextFilters.push({ id: "categoryId", value: filters.categoryId });
    }

    return nextFilters;
  }, [filters.accountId, filters.categoryId, filters.keyword, filters.type]);


  function handleColumnFiltersChange(updater: SetStateAction<ColumnFiltersState>) {
    const nextColumnFilters =
      typeof updater === "function" ? updater(columnFilters) : updater;
    const getFilterValue = (id: string) =>
      nextColumnFilters.find((filter) => filter.id === id)?.value;
    const firstValue = (value: unknown) => {
      if (Array.isArray(value)) {
        return value[0] ? String(value[0]) : "";
      }

      return value ? String(value) : "";
    };
    const nextType = firstValue(getFilterValue("type"));
    const normalizedType =
      nextType === CATEGORY_TYPES.INCOME || nextType === CATEGORY_TYPES.EXPENSE
        ? (nextType as CategoryType)
        : "all";
    const nextCategoryId = firstValue(getFilterValue("categoryId"));

    onFiltersChange({
      ...filters,
      keyword: firstValue(getFilterValue("description")),
      accountId: firstValue(getFilterValue("accountId")),
      type: normalizedType,
      categoryId: normalizedType !== filters.type ? "" : nextCategoryId,
      page: 1,
    });
  }

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: account.name,
      })),
    [accounts],
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .filter(
          (category) =>
            filters.type === "all" || !filters.type || category.type === filters.type,
        )
        .map((category) => ({
          value: category.id,
          label: category.name,
        })),
    [categories, filters.type],
  );

  if (isError) {
    return (
      <RetryCard
        title={t("transactions.title")}
        description={t("transactions.loadErrorDescription")}
        retryLabel={t("transactions.retry")}
        onRetry={onRetry}
      />
    );
  }

  return (
    <SectionCard
      title={t("transactions.title")}
      description={t("transactions.description")}
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
            <TransactionTableToolbar
              table={table}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
            />
          )}
        />
      )}

    </SectionCard>
  );
}
