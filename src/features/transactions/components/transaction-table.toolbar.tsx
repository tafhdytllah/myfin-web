"use client";

import { Table } from "@tanstack/react-table";

import { DataTableToolbar } from "@/components/data-table/toolbar";
import { useTranslations } from "@/lib/i18n/use-translations";
import { CATEGORY_TYPES } from "@/features/categories/types/category.types";

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
        columnId: "description",
        placeholder: t("transactions.searchPlaceholder"),
      }}
      filters={[
        {
          columnId: "accountId",
          placeholder: t("common.account"),
          clearLabel: t("transactions.resetFilters"),
          options: [
            { value: "all", label: t("transactions.allAccounts") },
            ...accountOptions,
          ],
        },
        {
          columnId: "type",
          placeholder: t("common.type"),
          clearLabel: t("transactions.resetFilters"),
          options: [
            { value: "all", label: t("transactions.allTypes") },
            { value: CATEGORY_TYPES.INCOME, label: t("common.income") },
            { value: CATEGORY_TYPES.EXPENSE, label: t("common.expense") },
          ],
        },
        {
          columnId: "categoryId",
          placeholder: t("common.category"),
          clearLabel: t("transactions.resetFilters"),
          options: [
            { value: "all", label: t("transactions.allCategories") },
            ...categoryOptions,
          ],
        },
      ]}
    />
  );
}
