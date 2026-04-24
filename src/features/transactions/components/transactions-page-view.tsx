"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { TransactionDeleteDialog } from "@/features/transactions/components/transaction-delete-dialog";
import { TransactionsFiltersCard } from "@/features/transactions/components/transactions-filters-card";
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
import { ResetFiltersButton } from "@/components/shared/reset-filters-button";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
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
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  const debouncedKeyword = useDebouncedValue(keyword);

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
  const selectedAccountName = useMemo(
    () => accounts.find((account) => account.id === filters.accountId)?.name,
    [accounts, filters.accountId],
  );
  const selectedTypeLabel = useMemo(() => {
    switch (filters.type) {
      case "INCOME":
        return t("common.income");
      case "EXPENSE":
        return t("common.expense");
      default:
        return t("transactions.allTypes");
    }
  }, [filters.type, t]);
  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.id === filters.categoryId)?.name,
    [categories, filters.categoryId],
  );

  const totalPages = transactionsEnvelope?.meta?.totalPages ?? 1;
  const currentPage = transactionsEnvelope?.meta?.page
    ? transactionsEnvelope.meta.page + 1
    : filters.page;
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

  useEffect(() => {
    if (debouncedKeyword === (filters.keyword ?? "")) {
      return;
    }

    updateFilters({
      ...filters,
      keyword: debouncedKeyword,
      page: 1,
    });
  }, [debouncedKeyword, filters, updateFilters]);

  function changePage(page: number) {
    updateFilters({
      ...filters,
      page,
    });
  }

  function resetFilters() {
    setKeyword("");
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

  function getCategoryOptions() {
    return categories.filter((category) => {
      const typeMatches =
        filters.type === "all" || !filters.type || category.type === filters.type;
      return typeMatches;
    });
  }

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
          columns: t("common.columns"),
          totalRows: (count) => t("common.totalRows", { count }),
          pageSummary: (current, total) => t("common.pageSummary", { current, total }),
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
          previous: t("transactions.previous"),
          next: t("transactions.next"),
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={changePage}
        onEdit={notifyEditUnavailable}
        onDelete={setDeletingTransaction}
        filters={
          <TransactionsFiltersCard
            keyword={keyword}
            searchPlaceholder={t("common.search")}
            onKeywordChange={setKeyword}
            accountValue={filters.accountId || "all"}
            accountPlaceholder={t("common.account")}
            accountDisplayValue={filters.accountId ? selectedAccountName : undefined}
            accountOptions={[
              { value: "all", label: t("transactions.allAccounts") },
              ...accounts.map((account) => ({
                value: account.id,
                label: account.name,
              })),
            ]}
            onAccountChange={(value) =>
              updateFilters({
                ...filters,
                accountId: value === "all" || value == null ? "" : value,
                page: 1,
              })
            }
            typeValue={filters.type ?? "all"}
            typePlaceholder={t("common.type")}
            typeDisplayValue={selectedTypeLabel}
            typeOptions={[
              { value: "all", label: t("transactions.allTypes") },
              { value: "INCOME", label: t("common.income") },
              { value: "EXPENSE", label: t("common.expense") },
            ]}
            onTypeChange={(value) =>
              updateFilters({
                ...filters,
                type: (value ?? "all") as "all" | "INCOME" | "EXPENSE",
                categoryId: "",
                page: 1,
              })
            }
            categoryValue={filters.categoryId || "all"}
            categoryPlaceholder={t("common.category")}
            categoryDisplayValue={filters.categoryId ? selectedCategoryName : undefined}
            categoryOptions={[
              { value: "all", label: t("transactions.allCategories") },
              ...getCategoryOptions().map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            onCategoryChange={(value) =>
              updateFilters({
                ...filters,
                categoryId: value === "all" || value == null ? "" : value,
                page: 1,
              })
            }
            startDate={filters.startDate ?? ""}
            endDate={filters.endDate ?? ""}
            onStartDateChange={(value) =>
              updateFilters({
                ...filters,
                startDate: value,
                page: 1,
              })
            }
            onEndDateChange={(value) =>
              updateFilters({
                ...filters,
                endDate: value,
                page: 1,
              })
            }
          />
        }
        primaryAction={
          <>
            {hasActiveFilters ? (
              <ResetFiltersButton
                label={t("transactions.resetFilters")}
                onClick={resetFilters}
              />
            ) : null}
            <PageActionButton onClick={() => setFormOpen(true)}>
              {t("transactions.addTransaction")}
            </PageActionButton>
          </>
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
