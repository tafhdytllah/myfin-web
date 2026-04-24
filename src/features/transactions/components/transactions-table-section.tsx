import { DataTable } from "@/components/shared/data-table";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { SectionCard } from "@/components/shared/section-card";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
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
}: TransactionsTableSectionProps) {
  const columns = buildTransactionsTableColumns({
    formatCurrency,
    formatDate,
    labels,
    onEdit,
    onDelete,
  });

  return (
    <SectionCard title={title} description={description}>
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
        <>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            minWidthClassName="min-w-[860px]"
          />

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            previousLabel={labels.previous}
            nextLabel={labels.next}
            onPageChange={onPageChange}
          />
        </>
      ) : null}
    </SectionCard>
  );
}
