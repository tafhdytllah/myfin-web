import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Trash2 } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { RowActionsMenu } from "@/components/row-actions-menu";
import { StatusBadge } from "@/components/status-badge";
import { Checkbox } from "@/components/ui/checkbox";

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

type BuildTransactionTableColumnsOptions = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  labels: TransactionTableLabels;
  onEdit: (row: TransactionRow) => void;
  onDelete: (row: TransactionRow) => void;
};

function includesFilterValue(rowValue: unknown, filterValue: unknown) {
  if (!filterValue || filterValue === "all") {
    return true;
  }

  if (Array.isArray(filterValue)) {
    return filterValue.length === 0 || filterValue.includes(rowValue);
  }

  return rowValue === filterValue;
}

export function buildTransactionTableColumns({
  formatCurrency,
  formatDate,
  labels,
  onEdit,
  onDelete,
}: BuildTransactionTableColumnsOptions): ColumnDef<TransactionRow>[] {
  return [
    {
      id: "search",
      accessorFn: (row) =>
        [
          row.description,
          row.accountName,
          row.categoryName,
          row.type === "INCOME" ? labels.income : labels.expense,
          formatDate(row.createdAt),
          formatCurrency(row.amount),
        ].join(" "),
      enableHiding: false,
      enableSorting: false,
      filterFn: (row, id, value) => {
        const searchValue = String(value ?? "").trim().toLowerCase();

        if (!searchValue) {
          return true;
        }

        return String(row.getValue(id)).toLowerCase().includes(searchValue);
      },
      meta: {
        label: labels.description,
      },
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
          }
          aria-label={labels.selectAllRows}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          aria-label={labels.selectTransactionRow(formatDate(row.original.createdAt))}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 44,
    },
    {
      accessorKey: "createdAt",
      meta: {
        label: labels.date,
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.date}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "type",
      meta: {
        label: labels.type,
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.type}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => (
        <StatusBadge tone={row.original.type === "INCOME" ? "income" : "expense"}>
          {row.original.type === "INCOME" ? labels.income : labels.expense}
        </StatusBadge>
      ),
      filterFn: (row, id, value) => includesFilterValue(row.getValue(id), value),
    },
    {
      accessorKey: "accountId",
      meta: {
        label: labels.account,
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.account}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => row.original.accountName,
      filterFn: (row, id, value) => includesFilterValue(row.getValue(id), value),
    },
    {
      accessorKey: "categoryId",
      meta: {
        label: labels.category,
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.category}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => row.original.categoryName,
      filterFn: (row, id, value) => includesFilterValue(row.getValue(id), value),
    },
    {
      accessorKey: "description",
      meta: {
        label: labels.description,
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.description}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-[var(--color-foreground-muted)]">
          {row.original.description || "-"}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      meta: {
        label: labels.amount,
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.amount}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => (
        <span className="font-semibold">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      header: () => <div className="text-right">{labels.actions}</div>,
      cell: ({ row }) => (
        <RowActionsMenu
          srLabel={labels.actions}
          items={[
            {
              label: labels.edit,
              icon: <PencilLine className="size-4" />,
              onSelect: () => onEdit(row.original),
            },
            {
              label: labels.delete,
              icon: <Trash2 className="size-4" />,
              destructive: true,
              onSelect: () => onDelete(row.original),
            },
          ]}
        />
      ),
    },
  ];
}

export type { TransactionRow, TransactionTableLabels };

