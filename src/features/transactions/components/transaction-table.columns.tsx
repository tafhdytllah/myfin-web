import { sortableHeader } from "@/components/data-table/sortable-header";
import { includesFilterValue } from "@/components/data-table/table-filter-utils";
import { RowActionsMenu } from "@/components/row-actions-menu";
import { StatusBadge } from "@/components/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORY_TYPES, CategoryType } from "@/features/categories/types/category.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Trash2 } from "lucide-react";
import { useMemo } from "react";

export type TransactionTableRow = {
  id: string;
  createdAt: string;
  type: CategoryType;
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
  onEdit: (row: TransactionTableRow) => void;
  onDelete: (row: TransactionTableRow) => void;
};

export function useTransactionTableColumns({
  formatCurrency,
  formatDate,
  onEdit,
  onDelete,
}: UseTransactionTableColumnsOptions): ColumnDef<TransactionTableRow>[] {
  const { t } = useTranslations();

  return useMemo(() => {
    const commonHeaderLabels = {
      ascLabel: t("common.sortAscending"),
      descLabel: t("common.sortDescending"),
      hideLabel: t("common.hideColumn"),
    };

    return [
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
            aria-label={t("common.selectTransactionRow", { description: row.original.description })}
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
        cell: ({ row }) => <div className="font-light">{formatDate(row.original.createdAt)}</div>,
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
          <StatusBadge tone={row.original.type === CATEGORY_TYPES.INCOME ? "income" : "expense"}>
            {row.original.type === CATEGORY_TYPES.INCOME ? t("common.income") : t("common.expense")}
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
        cell: ({ row }) => <div className="font-light">{row.original.accountName}</div>,
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
        cell: ({ row }) => <div className="font-light">{row.original.categoryName}</div>,
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
        cell: ({ row }) => <div className="font-light">{row.original.description || "-"}</div>,
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
        cell: ({ row }) => <span className="font-light">{formatCurrency(row.original.amount)}</span>,
      },
      {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        header: () => <div className="text-left">{t("common.actions")}</div>,
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

