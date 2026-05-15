"use client";

import {
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { SetStateAction, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { TransactionDeleteDialog } from "@/features/transactions/components/transaction-delete-dialog";
import { TransactionFormDialog } from "@/features/transactions/components/transaction-form-dialog";
import { TransactionsTableSection } from "@/features/transactions/components/transactions-table-section";
import {
  useEditTransactionUnavailable,
  useTransactions,
} from "@/features/transactions/hooks/use-transaction-queries";
import { Transaction } from "@/features/transactions/types/transaction-types";
import {
  buildTransactionSearchParams,
  parseTransactionFilters,
} from "@/features/transactions/utils/transaction-search-params";
import { PageActionButton } from "@/components/shared/page-action-button";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useLocaleStore } from "@/stores/locale-store";

export function TransactionsPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocaleStore((state) => state.locale);
  const { t } = useTranslations();
  const notifyEditUnavailable = useEditTransactionUnavailable();
  const filters = useMemo(
    () => parseTransactionFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const [formOpen, setFormOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const accountsQuery = useAccounts({ status: "all" });
  const categoriesQuery = useCategories({ status: "all", type: "all" });
  const transactionsQuery = useTransactions(filters);

  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const transactionsEnvelope = transactionsQuery.data;
  const transactions = useMemo(
    () => transactionsEnvelope?.data ?? [],
    [transactionsEnvelope?.data],
  );

  const accountsMap = useMemo(
    () => new Map(accounts.map((account) => [account.id, account])),
    [accounts],
  );
  const categoriesMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const rows = useMemo(
    () =>
      transactions.map((transaction) => ({
        ...transaction,
        accountName:
          accountsMap.get(transaction.accountId)?.name ?? t("common.account"),
        categoryName:
          categoriesMap.get(transaction.categoryId)?.name ?? t("common.category"),
      })),
    [accountsMap, categoriesMap, t, transactions],
  );
  const totalRows = transactionsEnvelope?.meta?.totalElements ?? rows.length;
  const dateLocale = locale === "id" ? "id-ID" : "en-US";
  const hasActiveFilters = Boolean(
    filters.keyword ||
      filters.accountId ||
      filters.type !== "all" ||
      filters.categoryId ||
      filters.startDate ||
      filters.endDate,
  );
  const modalTrail = useMemo(() => {
    if (deletingTransaction) {
      return t("common.delete");
    }

    if (formOpen) {
      return t("common.create");
    }

    return null;
  }, [deletingTransaction, formOpen, t]);

  usePageTrail([modalTrail]);

  const updateFilters = useCallback((nextFilters: typeof filters) => {
    const params = buildTransactionSearchParams(nextFilters);
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

  function resetFilters() {
    updateFilters({
      keyword: "",
      accountId: "",
      type: "all",
      categoryId: "",
      startDate: "",
      endDate: "",
      page: 1,
      size: filters.size,
    });
  }

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const nextFilters: ColumnFiltersState = [];

    if (filters.keyword) {
      nextFilters.push({ id: "search", value: filters.keyword });
    }

    if (filters.accountId) {
      nextFilters.push({ id: "accountId", value: [filters.accountId] });
    }

    if (filters.type && filters.type !== "all") {
      nextFilters.push({ id: "type", value: [filters.type] });
    }

    if (filters.categoryId) {
      nextFilters.push({ id: "categoryId", value: [filters.categoryId] });
    }

    return nextFilters;
  }, [filters.accountId, filters.categoryId, filters.keyword, filters.type]);

  const paginationState = useMemo<PaginationState>(
    () => ({
      pageIndex: Math.max(filters.page - 1, 0),
      pageSize: filters.size,
    }),
    [filters.page, filters.size],
  );

  const handleColumnFiltersChange = useCallback(
    (updater: SetStateAction<ColumnFiltersState>) => {
      const nextColumnFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      const getFilterValue = (id: string) =>
        nextColumnFilters.find((filter) => filter.id === id)?.value;
      const firstValue = (value: unknown) => {
        if (Array.isArray(value)) {
          return value[0] ? String(value[0]) : "";
        }

        return value ? String(value) : "";
      };
      const nextType = firstValue(getFilterValue("type"));

      updateFilters({
        ...filters,
        keyword: firstValue(getFilterValue("search")),
        accountId: firstValue(getFilterValue("accountId")),
        type: nextType === "INCOME" || nextType === "EXPENSE" ? nextType : "all",
        categoryId: firstValue(getFilterValue("categoryId")),
        page: 1,
      });
    },
    [columnFilters, filters, updateFilters],
  );

  const handlePaginationChange = useCallback(
    (updater: SetStateAction<PaginationState>) => {
      const nextPagination =
        typeof updater === "function" ? updater(paginationState) : updater;

      updateFilters({
        ...filters,
        page: nextPagination.pageIndex + 1,
        size: nextPagination.pageSize,
      });
    },
    [filters, paginationState, updateFilters],
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .filter(
          (category) =>
            filters.type === "all" || !filters.type || category.type === filters.type,
        )
        .map((category) => ({
          value: category.id,
          label: category.name,
        })),
    [categories, filters.type],
  );

  return (
    <div className="space-y-6">
      <TransactionsTableSection
        title={t("transactions.title")}
        description={t("transactions.description")}
        loading={transactionsQuery.isLoading}
        isError={transactionsQuery.isError}
        rows={rows}
        retryLabel={t("transactions.retry")}
        errorDescription={t("transactions.loadErrorDescription")}
        onRetry={() => transactionsQuery.refetch()}
        emptyDescription={t("transactions.emptyDescription")}
        emptyActionLabel={t("transactions.addTransaction")}
        onEmptyAction={() => setFormOpen(true)}
        hasActiveFilters={hasActiveFilters}
        resetFiltersLabel={t("transactions.resetFilters")}
        onResetFilters={resetFilters}
        formatDate={(value) => formatDate(value, dateLocale)}
        formatCurrency={formatCurrency}
        labels={{
          selectAllRows: t("common.selectAllRows"),
          selectTransactionRow: (date) =>
            t("common.selectTransactionRow", { date }),
          sortAscending: t("common.sortAscending"),
          sortDescending: t("common.sortDescending"),
          hideColumn: t("common.hideColumn"),
          date: t("common.date"),
          type: t("common.type"),
          account: t("common.account"),
          category: t("common.category"),
          description: t("common.description"),
          amount: t("common.amount"),
          actions: t("common.actions"),
          income: t("common.income"),
          expense: t("common.expense"),
          edit: t("transactions.edit"),
          delete: t("transactions.delete"),
        }}
        totalRows={totalRows}
        paginationState={paginationState}
        onPaginationChange={handlePaginationChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={handleColumnFiltersChange}
        onEdit={notifyEditUnavailable}
        onDelete={setDeletingTransaction}
        accountOptions={accounts.map((account) => ({
          value: account.id,
          label: account.name,
        }))}
        categoryOptions={categoryOptions}
        primaryAction={
          <PageActionButton onClick={() => setFormOpen(true)}>
            {t("transactions.addTransaction")}
          </PageActionButton>
        }
      />

      <div className="sr-only">
        <h1>{t("transactions.title")}</h1>
        <p>{t("transactions.description")}</p>
      </div>

      <TransactionFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <TransactionDeleteDialog
        transaction={deletingTransaction}
        categoryName={
          deletingTransaction
            ? categoriesMap.get(deletingTransaction.categoryId)?.name
            : undefined
        }
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => {
          if (!open) setDeletingTransaction(null);
        }}
      />
    </div>
  );
}
