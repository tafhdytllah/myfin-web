"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Power, PowerOff } from "lucide-react";

import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { Checkbox } from "@/components/ui/checkbox";

export type CategoryTableRow = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  active: boolean;
  usageCount: number;
};

type CategoryTableLabels = {
  category: string;
  type: string;
  status: string;
  used: string;
  actions: string;
  income: string;
  expense: string;
  active: string;
  inactive: string;
  edit: string;
  deactivate: string;
  activate: string;
  sortAscending: string;
  sortDescending: string;
  hideColumn: string;
  selectAllRows: string;
  selectCategoryRow: (name: string) => string;
};

type BuildCategoriesTableColumnsOptions = {
  labels: CategoryTableLabels;
  activatingPending: boolean;
  onEdit: (item: CategoryTableRow) => void;
  onDeactivate: (item: CategoryTableRow) => void;
  onActivate: (item: CategoryTableRow) => void;
};

export function buildCategoriesTableColumns({
  labels,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: BuildCategoriesTableColumnsOptions): ColumnDef<CategoryTableRow>[] {
  return [
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
          aria-label={labels.selectCategoryRow(row.original.name)}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 44,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.category}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "type",
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
    },
    {
      id: "status",
      accessorFn: (row) => (row.active ? "active" : "inactive"),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.status}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => (
        <StatusBadge tone={row.original.active ? "active" : "inactive"}>
          {row.original.active ? labels.active : labels.inactive}
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
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={labels.used}
          ascLabel={labels.sortAscending}
          descLabel={labels.sortDescending}
          hideLabel={labels.hideColumn}
        />
      ),
      cell: ({ row }) => row.original.usageCount,
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-right">
          <RowActionsMenu
            srLabel={labels.actions}
            items={[
              {
                label: labels.edit,
                icon: <PencilLine className="size-4" />,
                onSelect: () => onEdit(row.original),
              },
              row.original.active
                ? {
                    label: labels.deactivate,
                    icon: <PowerOff className="size-4" />,
                    onSelect: () => onDeactivate(row.original),
                  }
                : {
                    label: labels.activate,
                    icon: <Power className="size-4" />,
                    disabled: activatingPending,
                    onSelect: () => onActivate(row.original),
                  },
            ]}
          />
        </div>
      ),
    },
  ];
}
