"use client";

import { Table } from "@tanstack/react-table";

import { DataTableToolbar } from "@/components/shared/data-table/toolbar";
import { useTranslations } from "@/lib/i18n/use-translations";

type Option = {
  value: string;
  label: string;
};

type TransactionTableToolbarProps<TData> = {
  table: Table<TData>;
  accountOptions: Option[];
  categoryOptions: Option[];
};

export function TransactionTableToolbar<TData>({
  table,
  accountOptions,
  categoryOptions,
}: TransactionTableToolbarProps<TData>) {
  const { t } = useTranslations();

  return (
    <DataTableToolbar
      table={table}
      columnsLabel={t("common.columns")}
      resetLabel={t("transactions.resetFilters")}
      search={{
        columnId: "search",
        placeholder: t("common.search"),
      }}
      filters={[
        {
          columnId: "accountId",
          placeholder: t("common.account"),
          variant: "faceted",
          clearLabel: t("transactions.resetFilters"),
          selectedLabel: (count) => t("common.selectedRows", { count }),
          options: accountOptions,
        },
        {
          columnId: "type",
          placeholder: t("common.type"),
          variant: "faceted",
          clearLabel: t("transactions.resetFilters"),
          selectedLabel: (count) => t("common.selectedRows", { count }),
          options: [
            { value: "INCOME", label: t("common.income") },
            { value: "EXPENSE", label: t("common.expense") },
          ],
        },
        {
          columnId: "categoryId",
          placeholder: t("common.category"),
          variant: "faceted",
          clearLabel: t("transactions.resetFilters"),
          selectedLabel: (count) => t("common.selectedRows", { count }),
          options: categoryOptions,
        },
      ]}
    />
  );
}
