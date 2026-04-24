import { ReactNode, useMemo } from "react";

import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { ServerPagination } from "@/components/shared/server-pagination";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { TableWorkspace } from "@/components/shared/table-workspace";
import {
  buildTransactionsTableColumns,
  TransactionRow,
} from "@/features/transactions/components/transactions-table-columns";

type TransactionsTableSectionProps = {
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
    columns: string;
    totalRows: (count: number) => string;
    pageSummary: (current: number, total: number) => string;
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
    previous: string;
    next: string;
  };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (row: TransactionRow) => void;
  onDelete: (row: TransactionRow) => void;
  filters: ReactNode;
  primaryAction?: ReactNode;
};

export function TransactionsTableSection({
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
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  filters,
  primaryAction,
}: TransactionsTableSectionProps) {
  const columns = useMemo(
    () =>
      buildTransactionsTableColumns({
        formatCurrency,
        formatDate,
        labels,
        onEdit,
      onDelete,
      }),
    [formatCurrency, formatDate, labels, onDelete, onEdit],
  );

  return (
    <TableWorkspace
      title={title}
      description={description}
      toolbarStart={filters}
      toolbarEnd={
        <>
          {primaryAction}
        </>
      }
      footerStart={labels.totalRows(rows.length)}
      footerEnd={
        !loading && !isError && rows.length > 0 ? (
          <div className="flex flex-col items-start gap-3 md:items-end">
            <span>{labels.pageSummary(currentPage, totalPages)}</span>
            <ServerPagination
              currentPage={currentPage}
              totalPages={totalPages}
              previousLabel={labels.previous}
              nextLabel={labels.next}
              onPageChange={onPageChange}
            />
          </div>
        ) : null
      }
    >
      {loading ? <StackSkeleton count={5} itemClassName="h-14 rounded-xl bg-muted" /> : null}

      {isError ? (
        <InlineRetryState
          description={errorDescription}
          retryLabel={retryLabel}
          onRetry={onRetry}
        />
      ) : null}

      {!loading && !isError && rows.length === 0 ? (
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

      {!loading && !isError && rows.length > 0 ? (
        <DataTable
          columns={columns}
          data={rows}
          noResultsLabel={emptyDescription}
          pageSize={rows.length || 10}
          tableClassName="min-w-[860px]"
          toolbar={(table) => (
            <DataTableToolbar
              table={table}
              columnsLabel={labels.columns}
              resetLabel={resetFiltersLabel}
            />
          )}
          pagination={() => null}
        />
      ) : null}
    </TableWorkspace>
  );
}
