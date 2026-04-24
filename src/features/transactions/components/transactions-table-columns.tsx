import { PencilLine, Trash2 } from "lucide-react";

import { DataTableColumn } from "@/components/shared/data-table";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { StatusBadge } from "@/components/shared/status-badge";

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

type TransactionTableLabels = {
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

type BuildTransactionsTableColumnsOptions = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  labels: TransactionTableLabels;
  onEdit: (row: TransactionRow) => void;
  onDelete: (row: TransactionRow) => void;
};

export function buildTransactionsTableColumns({
  formatCurrency,
  formatDate,
  labels,
  onEdit,
  onDelete,
}: BuildTransactionsTableColumnsOptions): DataTableColumn<TransactionRow>[] {
  return [
    {
      id: "date",
      header: labels.date,
      visibilityLabel: labels.date,
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "type",
      header: labels.type,
      visibilityLabel: labels.type,
      cell: (row) => (
        <StatusBadge tone={row.type === "INCOME" ? "income" : "expense"}>
          {row.type === "INCOME" ? labels.income : labels.expense}
        </StatusBadge>
      ),
    },
    {
      id: "account",
      header: labels.account,
      visibilityLabel: labels.account,
      cell: (row) => row.accountName,
    },
    {
      id: "category",
      header: labels.category,
      visibilityLabel: labels.category,
      cell: (row) => row.categoryName,
    },
    {
      id: "description",
      header: labels.description,
      visibilityLabel: labels.description,
      cellClassName: "max-w-xs truncate text-[var(--color-foreground-muted)]",
      cell: (row) => row.description || "-",
    },
    {
      id: "amount",
      header: labels.amount,
      visibilityLabel: labels.amount,
      cellClassName: "font-semibold",
      cell: (row) => formatCurrency(row.amount),
    },
    {
      id: "actions",
      header: labels.actions,
      visibilityLabel: labels.actions,
      headerClassName: "text-right",
      cellClassName: "text-right",
      canHide: false,
      cell: (row) => (
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
      ),
    },
  ];
}

export type { TransactionRow, TransactionTableLabels };
