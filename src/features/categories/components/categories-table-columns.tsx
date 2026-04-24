import { PencilLine, Power, PowerOff } from "lucide-react";

import { DataTableColumn } from "@/components/shared/data-table";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { StatusBadge } from "@/components/shared/status-badge";

type CategoryItem = {
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
};

type BuildCategoriesTableColumnsOptions = {
  labels: CategoryTableLabels;
  activatingPending: boolean;
  onEdit: (item: CategoryItem) => void;
  onDeactivate: (item: CategoryItem) => void;
  onActivate: (item: CategoryItem) => void;
};

export function buildCategoriesTableColumns({
  labels,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: BuildCategoriesTableColumnsOptions): DataTableColumn<CategoryItem>[] {
  return [
    {
      id: "name",
      header: labels.category,
      cellClassName: "font-medium",
      cell: (item) => item.name,
    },
    {
      id: "type",
      header: labels.type,
      cell: (item) => (
        <StatusBadge tone={item.type === "INCOME" ? "income" : "expense"}>
          {item.type === "INCOME" ? labels.income : labels.expense}
        </StatusBadge>
      ),
    },
    {
      id: "status",
      header: labels.status,
      cell: (item) => (
        <StatusBadge tone={item.active ? "active" : "inactive"}>
          {item.active ? labels.active : labels.inactive}
        </StatusBadge>
      ),
    },
    {
      id: "used",
      header: labels.used,
      cell: (item) => item.usageCount,
    },
    {
      id: "actions",
      header: labels.actions,
      headerClassName: "text-right",
      cellClassName: "text-right",
      cell: (item) => (
        <RowActionsMenu
          srLabel={labels.actions}
          items={[
            {
              label: labels.edit,
              icon: <PencilLine className="size-4" />,
              onSelect: () => onEdit(item),
            },
            item.active
              ? {
                  label: labels.deactivate,
                  icon: <PowerOff className="size-4" />,
                  onSelect: () => onDeactivate(item),
                }
              : {
                  label: labels.activate,
                  icon: <Power className="size-4" />,
                  disabled: activatingPending,
                  onSelect: () => onActivate(item),
                },
          ]}
        />
      ),
    },
  ];
}

export type { CategoryItem, CategoryTableLabels };
