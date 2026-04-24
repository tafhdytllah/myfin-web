"use client";

import { Table } from "@tanstack/react-table";

import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { useTranslations } from "@/lib/i18n/use-translations";

type CategoryTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function CategoryTableToolbar<TData>({
  table,
}: CategoryTableToolbarProps<TData>) {
  const { t } = useTranslations();

  return (
    <DataTableToolbar
      table={table}
      columnsLabel={t("common.columns")}
      resetLabel={t("categories.resetFilters")}
      search={{
        columnId: "name",
        placeholder: t("categories.searchPlaceholder"),
      }}
      filters={[
        {
          columnId: "type",
          placeholder: t("common.type"),
          options: [
            { value: "all", label: t("categories.typeAll") },
            { value: "INCOME", label: t("common.income") },
            { value: "EXPENSE", label: t("common.expense") },
          ],
        },
        {
          columnId: "status",
          placeholder: t("common.status"),
          options: [
            { value: "all", label: t("categories.statusAll") },
            { value: "active", label: t("common.active") },
            { value: "inactive", label: t("common.inactive") },
          ],
        },
      ]}
    />
  );
}
