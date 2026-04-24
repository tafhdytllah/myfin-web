import { PencilLine, Trash2 } from "lucide-react";

import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SectionCard } from "@/components/shared/section-card";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableHeaderCell } from "@/components/shared/table-header-cell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TransactionRow = {
  id: string;
  createdAt: string;
  type: "INCOME" | "EXPENSE";
  accountId: string;
  categoryId: string;
  accountName: string;
  categoryName: string;
  description: string;
  amount: number;
};

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
          <div className="overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHeaderCell>{labels.date}</TableHeaderCell>
                  <TableHeaderCell>{labels.type}</TableHeaderCell>
                  <TableHeaderCell>{labels.account}</TableHeaderCell>
                  <TableHeaderCell>{labels.category}</TableHeaderCell>
                  <TableHeaderCell>{labels.description}</TableHeaderCell>
                  <TableHeaderCell>{labels.amount}</TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    {labels.actions}
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge tone={row.type === "INCOME" ? "income" : "expense"}>
                        {row.type === "INCOME" ? labels.income : labels.expense}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{row.accountName}</TableCell>
                    <TableCell>{row.categoryName}</TableCell>
                    <TableCell className="max-w-xs truncate text-[var(--color-foreground-muted)]">
                      {row.description || "-"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(row.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActionsMenu
                        srLabel={labels.actions}
                        items={[
                          {
                            label: labels.edit,
                            icon: <PencilLine className="size-4" />,
                            onSelect: () => onEdit(row),
                          },
                          {
                            label: labels.delete,
                            icon: <Trash2 className="size-4" />,
                            destructive: true,
                            onSelect: () => onDelete(row),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 ? (
            <Pagination className="mt-6 justify-center md:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text={labels.previous}
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage > 1) onPageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          onPageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    text={labels.next}
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage < totalPages) onPageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </>
      ) : null}
    </SectionCard>
  );
}
