import {
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
} from "@tanstack/react-table";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";

import { DataTable } from "@/components/data-table/table";
import { RetryCard } from "@/components/retry-card";
import { SectionCard } from "@/components/section-card";
import { SectionEmptyState } from "@/components/section-empty-state";
import { StackSkeleton } from "@/components/stack-skeleton";
import {
  TransactionRow,
  useTransactionTableColumns
} from "@/features/transactions/components/transaction-table.columns";
import { TransactionTableToolbar } from "@/features/transactions/components/transaction-table.toolbar";
import { useTranslations } from "@/lib/i18n/use-translations";

type Option = {
  value: string;
  label: string;
};

type TransactionMainSectionProps = {
  loading: boolean;
  isError: boolean;
  rows: TransactionRow[];
  onRetry: () => void;
  action?: ReactNode;
  onEmptyAction: () => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  formatDate: (value: string) => string;
  formatCurrency: (value: number) => string;
  totalRows: number;
  paginationState: PaginationState;
  onPaginationChange: Dispatch<SetStateAction<PaginationState>>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: Dispatch<SetStateAction<ColumnFiltersState>>;
  onEdit: (row: TransactionRow) => void;
  onDelete: (row: TransactionRow) => void;
  accountOptions: Option[];
  categoryOptions: Option[];
};

export function TransactionMainSection({
  loading,
  isError,
  rows,
  onRetry,
  action,
  onEmptyAction,
  hasActiveFilters,
  onResetFilters,
  formatDate,
  formatCurrency,
  totalRows,
  paginationState,
  onPaginationChange,
  columnFilters,
  onColumnFiltersChange,
  onEdit,
  onDelete,
  accountOptions,
  categoryOptions,
}: TransactionMainSectionProps) {
  const { t } = useTranslations();

  const columns = useTransactionTableColumns({
    formatCurrency,
    formatDate,
    onEdit,
    onDelete,
  });
  
  const initialColumnVisibility = useMemo<VisibilityState>(
    () => ({
      search: false,
    }),
    [],
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
      {loading ? (
        <StackSkeleton count={5} itemClassName="h-14 rounded-xl bg-muted" />
      ) : null}

      {!loading && rows.length === 0 ? (
        <SectionEmptyState
          description={t("transactions.emptyDescription")}
          actions={[
            {
              label: t("transactions.addTransaction"),
              onClick: onEmptyAction,
            },
            ...(hasActiveFilters
              ? [
                {
                  label: t("transactions.resetFilters"),
                  onClick: onResetFilters,
                  variant: "outline" as const,
                },
              ]
              : []),
          ]}
        />
      ) : null}

      {!loading && rows.length > 0 ? (
        <DataTable
          columns={columns}
          data={rows}
          pageSize={paginationState.pageSize}
          bordered
          manualFiltering
          manualPagination
          total={totalRows}
          paginationState={paginationState}
          setPaginationState={onPaginationChange}
          columnFilters={columnFilters}
          setColumnFilters={onColumnFiltersChange}
          initialColumnVisibility={initialColumnVisibility}
          toolbar={(table) => (
            <TransactionTableToolbar
              table={table}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
            />
          )}
        />
      ) : null}
    </SectionCard>
  );
}
