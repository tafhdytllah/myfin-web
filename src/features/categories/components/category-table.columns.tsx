import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Power, PowerOff } from "lucide-react";

import { sortableHeader } from "@/components/data-table/sortable-header";
import { includesFilterValue } from "@/components/data-table/table-filter-utils";
import { StatusBadge } from "@/components/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORY_TYPES, CategoryType } from "@/features/categories/types/category.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useMemo } from "react";
import { RowActionsMenu } from "@/components/row-actions-menu";

export type CategoryTableRow = {
  id: string;
  name: string;
  type: CategoryType;
  active: boolean;
  usageCount: number;
};

type UseCategoryTableColumnsOptions = {
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
}: UseCategoryTableColumnsOptions): ColumnDef<CategoryTableRow>[] {
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
        header: sortableHeader({
          title: t("common.category"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => <div className="font-light">{row.original.name}</div>,
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
        id: "status",
        accessorFn: (row) => (row.active ? "active" : "inactive"),
        meta: {
          label: t("common.status"),
        },
        header: sortableHeader({
          title: t("common.status"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => (
          <StatusBadge tone={row.original.active ? "active" : "inactive"}>
            {row.original.active ? t("common.active") : t("common.inactive")}
          </StatusBadge>
        ),
        filterFn: (row, id, value) => {
          return includesFilterValue(row.getValue(id), value);
        },
      },
      {
        accessorKey: "usageCount",
        meta: {
          label: t("common.used"),
        },
        header: sortableHeader({
          title: t("common.used"),
          ...commonHeaderLabels,
        }),
        cell: ({ row }) => <div className="font-light">{row.original.usageCount}</div>,
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
                label: t("common.edit"),
                icon: <PencilLine className="size-4" />,
                onSelect: () => onEdit(row.original),
              },
              row.original.active
                ? {
                  label: t("common.deactivate"),
                  icon: <PowerOff className="size-4" />,
                  onSelect: () => onDeactivate(row.original),
                }
                : {
                  label: t("common.activate"),
                  icon: <Power className="size-4" />,
                  disabled: activatingPending,
                  onSelect: () => onActivate(row.original),
                },
            ]}
          />
        ),
      },
    ];
  }, [activatingPending, onEdit, onDeactivate, onActivate, t]);
}
