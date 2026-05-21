import {
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
} from "@tanstack/react-table";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";

import { DataTable } from "@/components/shared/data-table/table";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import {
  buildTransactionTableColumns,
  TransactionRow,
} from "@/features/transactions/components/transaction-table.columns";
import { TransactionTableToolbar } from "@/features/transactions/components/transaction-table.toolbar";

type Option = {
  value: string;
  label: string;
};

type TransactionTableSectionProps = {
  title: string;
  description: string;
  loading: boolean;
  isError: boolean;
  rows: TransactionRow[];
  retryLabel: string;
  errorDescription: string;
  onRetry: () => void;
  emptyDescription: string;
  emptyActionLabel: string;
  onEmptyAction: () => void;
  hasActiveFilters: boolean;
  resetFiltersLabel: string;
  onResetFilters: () => void;
  formatDate: (value: string) => string;
  formatCurrency: (value: number) => string;
  labels: {
    selectAllRows: string;
    selectTransactionRow: (date: string) => string;
    sortAscending: string;
    sortDescending: string;
    hideColumn: string;
    date: string;
    type: string;
    account: string;
    category: string;
    description: string;
    amount: string;
    actions: string;
    income: string;
    expense: string;
    edit: string;
    delete: string;
  };
  totalRows: number;
  paginationState: PaginationState;
  onPaginationChange: Dispatch<SetStateAction<PaginationState>>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: Dispatch<SetStateAction<ColumnFiltersState>>;
  onEdit: (row: TransactionRow) => void;
  onDelete: (row: TransactionRow) => void;
  accountOptions: Option[];
  categoryOptions: Option[];
  primaryAction?: ReactNode;
};

export function TransactionTableSection({
  title,
  description,
  loading,
  isError,
  rows,
  retryLabel,
  errorDescription,
  onRetry,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  hasActiveFilters,
  resetFiltersLabel,
  onResetFilters,
  formatDate,
  formatCurrency,
  labels,
  totalRows,
  paginationState,
  onPaginationChange,
  columnFilters,
  onColumnFiltersChange,
  onEdit,
  onDelete,
  accountOptions,
  categoryOptions,
  primaryAction,
}: TransactionTableSectionProps) {
  const columns = useMemo(
    () =>
      buildTransactionTableColumns({
        formatCurrency,
        formatDate,
        labels,
        onEdit,
        onDelete,
      }),
    [formatCurrency, formatDate, labels, onDelete, onEdit],
  );
  const initialColumnVisibility = useMemo<VisibilityState>(
    () => ({
      search: false,
    }),
    [],
  );

  if (loading) {
    return (
      <SectionCard title={title} description={description} action={primaryAction}>
        <StackSkeleton count={5} itemClassName="h-14 rounded-xl bg-muted" />
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <RetryCard
        title={title}
        description={errorDescription}
        retryLabel={retryLabel}
        onRetry={onRetry}
      />
    );
  }

  return (
    <SectionCard title={title} description={description} action={primaryAction}>
      {rows.length === 0 ? (
        <SectionEmptyState
          description={emptyDescription}
          actions={[
            {
              label: emptyActionLabel,
              onClick: onEmptyAction,
            },
            ...(hasActiveFilters
              ? [
                {
                  label: resetFiltersLabel,
                  onClick: onResetFilters,
                  variant: "outline" as const,
                },
              ]
              : []),
          ]}
        />
      ) : null}

      {rows.length > 0 ? (
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
