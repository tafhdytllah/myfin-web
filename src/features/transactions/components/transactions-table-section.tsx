import { ReactNode, useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { TableColumnVisibilityMenu } from "@/components/shared/table-column-visibility-menu";
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
    columnsMenu: string;
    selectedRows: (count: number) => string;
    totalRows: (count: number) => string;
    pageSummary: (current: number, total: number) => string;
    selectAllRows: string;
    selectTransactionRow: (date: string) => string;
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
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [columnPreferences, setColumnPreferences] = useState<string[]>([]);
  const visibleColumnIds = useMemo(() => {
    const nextColumnIds = columns.map((column) => column.id);

    if (columnPreferences.length === 0) {
      return nextColumnIds;
    }

    const preservedIds = columnPreferences.filter((id) => nextColumnIds.includes(id));
    const addedIds = nextColumnIds.filter((id) => !preservedIds.includes(id));

    return [...preservedIds, ...addedIds];
  }, [columnPreferences, columns]);
  const resolvedSelectedRowIds = useMemo(() => {
    const rowIds = new Set(rows.map((row) => row.id));

    return selectedRowIds.filter((id) => rowIds.has(id));
  }, [rows, selectedRowIds]);

  return (
    <TableWorkspace
      title={title}
      description={description}
      toolbarStart={filters}
      toolbarEnd={
        <>
          {primaryAction}
          <TableColumnVisibilityMenu
            columns={columns}
            visibleColumnIds={visibleColumnIds}
            onVisibleColumnIdsChange={setColumnPreferences}
            triggerLabel={labels.columns}
            menuLabel={labels.columnsMenu}
          />
        </>
      }
      footerStart={
        resolvedSelectedRowIds.length > 0
          ? labels.selectedRows(resolvedSelectedRowIds.length)
          : labels.totalRows(rows.length)
      }
      footerEnd={
        !loading && !isError && rows.length > 0 ? (
          <div className="flex flex-col items-start gap-3 md:items-end">
            <span>{labels.pageSummary(currentPage, totalPages)}</span>
            <DataTablePagination
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
            rows={rows}
            rowKey={(row) => row.id}
            minWidthClassName="min-w-[860px]"
            visibleColumnIds={visibleColumnIds}
            selectedRowIds={resolvedSelectedRowIds}
            onSelectedRowIdsChange={setSelectedRowIds}
            selectAllLabel={labels.selectAllRows}
            selectRowLabel={(row) =>
              labels.selectTransactionRow(formatDate(row.createdAt))
            }
          />
      ) : null}
    </TableWorkspace>
  );
}
