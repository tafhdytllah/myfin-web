import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Power, PowerOff } from "lucide-react";

import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useMemo } from "react";

export type CategoryTableRow = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  active: boolean;
  usageCount: number;
};

type BuildCategoryTableColumnsOptions = {
  activatingPending: boolean;
  onEdit: (item: CategoryTableRow) => void;
  onDeactivate: (item: CategoryTableRow) => void;
  onActivate: (item: CategoryTableRow) => void;
};

export function useCategoryTableColumns({
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: BuildCategoryTableColumnsOptions): ColumnDef<CategoryTableRow>[] {
  const { t } = useTranslations();

  return useMemo(
    () => [
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
            aria-label={t("common.selectCategoryRow", { name: row.original.name })}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 44,
      },
      {
        accessorKey: "name",
        meta: {
          label: t("common.category"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("common.category")}
            ascLabel={t("common.sortAscending")}
            descLabel={t("common.sortDescending")}
            hideLabel={t("common.hideColumn")}
          />
        ),
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
      },
      {
        accessorKey: "type",
        meta: {
          label: t("common.type"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("common.type")}
            ascLabel={t("common.sortAscending")}
            descLabel={t("common.sortDescending")}
            hideLabel={t("common.hideColumn")}
          />
        ),
        cell: ({ row }) => (
          <StatusBadge tone={row.original.type === "INCOME" ? "income" : "expense"}>
            {row.original.type === "INCOME" ? t("common.income") : t("common.expense")}
          </StatusBadge>
        ),
        filterFn: (row, id, value) => {
          if (!value || value === "all") {
            return true;
          }

          return row.getValue(id) === value;
        },
      },
      {
        id: "status",
        accessorFn: (row) => (row.active ? "active" : "inactive"),
        meta: {
          label: t("common.status"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("common.status")}
            ascLabel={t("common.sortAscending")}
            descLabel={t("common.sortDescending")}
            hideLabel={t("common.hideColumn")}
          />
        ),
        cell: ({ row }) => (
          <StatusBadge tone={row.original.active ? "active" : "inactive"}>
            {row.original.active ? t("common.active") : t("common.inactive")}
          </StatusBadge>
        ),
        filterFn: (row, id, value) => {
          if (!value || value === "all") {
            return true;
          }

          return row.getValue(id) === value;
        },
      },
      {
        accessorKey: "usageCount",
        meta: {
          label: t("common.used"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("common.used")}
            ascLabel={t("common.sortAscending")}
            descLabel={t("common.sortDescending")}
            hideLabel={t("common.hideColumn")}
          />
        ),
        cell: ({ row }) => row.original.usageCount,
      },
      {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        header: () => <div className="text-right">{t("common.actions")}</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("common.edit")}
              title={t("common.edit")}
              onClick={() => onEdit(row.original)}
            >
              <PencilLine className="size-4" />
            </Button>
            {row.original.active ? (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("common.deactivate")}
                title={t("common.deactivate")}
                onClick={() => onDeactivate(row.original)}
              >
                <PowerOff className="size-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("common.activate")}
                title={t("common.activate")}
                disabled={activatingPending}
                onClick={() => onActivate(row.original)}
              >
                <Power className="size-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [activatingPending, onEdit, onDeactivate, onActivate, t],
  );
}
