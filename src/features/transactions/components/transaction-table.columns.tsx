import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Trash2 } from "lucide-react";
import { RowActionsMenu } from "@/components/row-actions-menu";
import { StatusBadge } from "@/components/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useMemo } from "react";
import { sortableHeader } from "@/components/data-table/sortable-header";

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

type UseTransactionTableColumnsOptions = {
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
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

export function useTransactionTableColumns({
  formatCurrency,
  formatDate,
  onEdit,
  onDelete,
}: UseTransactionTableColumnsOptions): ColumnDef<TransactionRow>[] {
  const { t } = useTranslations();

  return useMemo(() => {
    const commonHeaderLabels = {
      ascLabel: t("common.sortAscending"),
      descLabel: t("common.sortDescending"),
      hideLabel: t("common.hideColumn"),
    };

    return [
      {
        id: "search",
        accessorFn: (row) =>
          [
            row.description,
            row.accountName,
            row.categoryName,
            row.type === "INCOME" ? t("common.income") : t("common.expense"),
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
          label: t("common.description"),
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
            aria-label={t("common.selectAllRows")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            aria-label={t("common.selectTransactionRow", { date: formatDate(row.original.createdAt) })}
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
          label: t("common.date"),
        },
        header: sortableHeader({
          title: t("common.date"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: "type",
        meta: {
          label: t("common.type"),
        },
        header: sortableHeader({
          title: t("common.type"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => (
          <StatusBadge tone={row.original.type === "INCOME" ? "income" : "expense"}>
            {row.original.type === "INCOME" ? t("common.income") : t("common.expense")}
          </StatusBadge>
        ),
        filterFn: (row, id, value) => includesFilterValue(row.getValue(id), value),
      },
      {
        accessorKey: "accountId",
        meta: {
          label: t("common.account"),
        },
        header: sortableHeader({
          title: t("common.account"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => row.original.accountName,
        filterFn: (row, id, value) => includesFilterValue(row.getValue(id), value),
      },
      {
        accessorKey: "categoryId",
        meta: {
          label: t("common.category"),
        },
        header: sortableHeader({
          title: t("common.category"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => row.original.categoryName,
        filterFn: (row, id, value) => includesFilterValue(row.getValue(id), value),
      },
      {
        accessorKey: "description",
        meta: {
          label: t("common.description"),
        },
        header: sortableHeader({
          title: t("common.description"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => (
          <div className="max-w-xs truncate text-(--color-foreground-muted)">
            {row.original.description || "-"}
          </div>
        ),
      },
      {
        accessorKey: "amount",
        meta: {
          label: t("common.amount"),
        },
        header: sortableHeader({
          title: t("common.amount"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => (
          <span className="font-semibold">{formatCurrency(row.original.amount)}</span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        header: () => <div className="text-right">{t("common.actions")}</div>,
        cell: ({ row }) => (
          <RowActionsMenu
            srLabel={t("common.actions")}
            items={[
              {
                label: t("transactions.edit"),
                icon: <PencilLine className="size-4" />,
                onSelect: () => onEdit(row.original),
              },
              {
                label: t("transactions.delete"),
                icon: <Trash2 className="size-4" />,
                destructive: true,
                onSelect: () => onDelete(row.original),
              },
            ]}
          />
        ),
      },
    ];
  }, [formatCurrency, formatDate, onDelete, onEdit, t]);
}

export type { TransactionRow };

