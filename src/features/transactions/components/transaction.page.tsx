"use client";

import { ConfirmActionDialog } from "@/components/confirm-action-dialog";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { PageActionButton } from "@/components/page-action-button";
import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { TransactionFormDialog } from "@/features/transactions/components/transaction-form.dialog";
import { TransactionMainSection } from "@/features/transactions/components/transaction-main.section";
import { useDeleteTransaction } from "@/features/transactions/hooks/use-transaction-mutations";
import {
  useEditTransactionUnavailable,
  useTransactions,
} from "@/features/transactions/hooks/use-transaction-queries";
import { Transaction } from "@/features/transactions/types/transaction.types";
import {
  buildTransactionSearchParams,
  parseTransactionFilters,
} from "@/features/transactions/utils/transaction-search-params";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useLocaleStore } from "@/stores/locale-store";
import {
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useCallback, useMemo, useState } from "react";

export function TransactionPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocaleStore((state) => state.locale);

  const [deletingTransactionDialog, setDeletingTransactionDialog] = useState<Transaction | null>(null);

  const deleteMutation = useDeleteTransaction(() => {
    setDeletingTransactionDialog(null);
  });

  const notifyEditUnavailable = useEditTransactionUnavailable();
  const filters = useMemo(
    () => parseTransactionFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const [formOpen, setFormOpen] = useState(false);

  const accountsQuery = useAccounts({ status: "all" });
  const categoriesQuery = useCategories({ status: "all", type: "all" });
  const transactionsQuery = useTransactions(filters);

  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);
  const categories = useMemo(() => categoriesQuery.data?.items ?? [], [categoriesQuery.data]);
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
    if (deletingTransactionDialog) {
      return t("common.delete");
    }

    if (formOpen) {
      return t("common.create");
    }

    return null;
  }, [deletingTransactionDialog, formOpen, t]);

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
      <TransactionMainSection
        loading={transactionsQuery.isLoading}
        isError={transactionsQuery.isError}
        rows={rows}
        onRetry={() => transactionsQuery.refetch()}
        onEmptyAction={() => setFormOpen(true)}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
        formatDate={(value) => formatDate(value, dateLocale)}
        formatCurrency={formatCurrency}
        totalRows={totalRows}
        paginationState={paginationState}
        onPaginationChange={handlePaginationChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={handleColumnFiltersChange}
        onEdit={notifyEditUnavailable}
        onDelete={setDeletingTransactionDialog}
        accountOptions={accounts.map((account) => ({
          value: account.id,
          label: account.name,
        }))}
        categoryOptions={categoryOptions}
        action={
          <PageActionButton onClick={() => setFormOpen(true)}>
            {t("transactions.addTransaction")}
          </PageActionButton>
        }
      />

      <div className="sr-only">
        <h1>{t("transactions.title")}</h1>
        <p>{t("transactions.description")}</p>
      </div>

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <ConfirmActionDialog
        open={Boolean(deletingTransactionDialog)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTransactionDialog(null);
          }
        }}
        pending={deleteMutation.isPending}
        title={t("transactions.deleteTitle")}
        description={t("transactions.deleteDescription")}
        cancelLabel={t("transactions.cancel")}
        confirmLabel={t("transactions.delete")}
        pendingLabel={t("transactions.deleting")}
        details={
          deletingTransactionDialog ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm">
              <p className="font-medium">
                {categoriesMap.get(deletingTransactionDialog.categoryId)?.name ??
                  t("common.category")}
                {" - "}
                {formatCurrency(deletingTransactionDialog.amount)}
              </p>

              <p className="mt-1 text-muted-foreground">
                {formatDate(
                  deletingTransactionDialog.createdAt,
                  dateLocale,
                )}
              </p>
            </div>
          ) : null
        }
        onConfirm={() => {
          if (!deletingTransactionDialog) {
            return Promise.resolve();
          }

          return deleteMutation.mutate(
            deletingTransactionDialog!.id,
          );
        }}
      />
    </div>
  );
}
