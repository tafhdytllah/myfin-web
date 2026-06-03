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
  useTransactions,
} from "@/features/transactions/hooks/use-transaction-queries";
import { Transaction, TransactionListFilters } from "@/features/transactions/types/transaction.types";
import {
  buildTransactionSearchParams,
  parseTransactionFilters,
} from "@/features/transactions/utils/transaction-search-params";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useLocaleStore } from "@/stores/locale-store";
import {
  PaginationState,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

export function TransactionPage() {
  const { t } = useTranslations();

  const locale = useLocaleStore((state) => state.locale);

  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseTransactionFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const [formOpen, setFormOpen] = useState(false);

  const [keyword, setKeyword] = useState(filters.keyword ?? "");

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [deleteDialogTransaction, setDeleteDialogTransaction] = useState<Transaction | null>(null);

  const debouncedKeyword = useDebouncedValue(keyword);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      keyword: debouncedKeyword,
    }),
    [debouncedKeyword, filters],
  );

  const deleteMutation = useDeleteTransaction(() => {
    setDeleteDialogTransaction(null)
  });

  const accountsQuery = useAccounts({ status: "all" });

  const categoriesQuery = useCategories({
    status: "all",
    type: "all",
    page: 1,
    size: 100
  });

  const transactionsQuery = useTransactions(queryFilters);

  const accounts = useMemo(() =>
    accountsQuery.data ?? [],
    [accountsQuery.data]
  );

  const categories = useMemo(() =>
    categoriesQuery.data?.items ?? [],
    [categoriesQuery.data]
  );

  const transactionsRaw1 = useMemo(() =>
    transactionsQuery.data?.items ?? [],
    [transactionsQuery.data]
  );

  const accountRows = useMemo(
    () => new Map(accounts.map((item) => [item.id, item])),
    [accounts],
  );

  const categoryRows = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories],
  );

  const transactionRows = useMemo(
    () =>
      transactionsRaw1.map((item) => ({
        ...item,
        accountName: accountRows.get(item.accountId)?.name ?? t("common.account"),
        categoryName: categoryRows.get(item.categoryId)?.name ?? t("common.category"),
      })),
    [accountRows, categoryRows, t, transactionsRaw1],
  );

  const totalRowTransactions = transactionsQuery.data?.meta?.totalElements ?? transactionRows.length;

  const modalTrail = useMemo(() => {
    if (deleteDialogTransaction) {
      return t("common.delete");
    }

    if (formOpen) {
      return t("common.create");
    }

    if (editingTransaction) {
      return t("common.edit");
    }

    return null;
  }, [editingTransaction, deleteDialogTransaction, formOpen, t]);

  usePageTrail([modalTrail]);

  const updateFilters = useCallback((nextFilters: TransactionListFilters) => {
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
    });
  }, [debouncedKeyword, filters, updateFilters]);

  function handleFiltersChange(nextFilters: TransactionListFilters) {
    setKeyword(nextFilters.keyword ?? "");

    if (nextFilters.type === filters.type
      && nextFilters.accountId === filters.accountId
      && nextFilters.categoryId === filters.categoryId
      && nextFilters.startDate === filters.startDate
      && nextFilters.endDate === filters.endDate
    ) {
      return;
    }

    updateFilters({
      ...nextFilters,
      keyword: filters.keyword ?? "",
    });
  }

  const paginationState = useMemo<PaginationState>(
    () => ({
      pageIndex: Math.max(filters.page - 1, 0),
      pageSize: filters.size,
    }),
    [filters.page, filters.size],
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


  function openCreateDialog() {
    setEditingTransaction(null);
    setFormOpen(true);
  }

  function openEditDialog(item: Transaction) {
    setFormOpen(false);
    setEditingTransaction(item);
  }

  return (
    <div className="space-y-6">
      <TransactionMainSection
        accounts={accounts}
        categories={categories}
        items={transactionRows}
        totalRows={totalRowTransactions}
        isLoading={transactionsQuery.isLoading}
        isError={transactionsQuery.isError}
        filters={{ ...filters, keyword }}
        onFiltersChange={handleFiltersChange}
        onRetry={() => transactionsQuery.refetch()}
        paginationState={paginationState}
        onPaginationChange={handlePaginationChange}
        onEdit={openEditDialog}
        onDelete={setDeleteDialogTransaction}
        action={
          <PageActionButton onClick={openCreateDialog}>
            <Plus className="size-4" />
            {t("transactions.addTransaction")}
          </PageActionButton>
        }
        formatDate={(value) => formatDate(value, dateLocale)}
        formatCurrency={formatCurrency}
      />

      <TransactionFormDialog
        transaction={editingTransaction}
        open={formOpen || Boolean(editingTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingTransaction(null);
          }
        }}
      />

      <ConfirmActionDialog
        open={Boolean(deleteDialogTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogTransaction(null);
          }
        }}
        pending={deleteMutation.isPending}
        title={t("transactions.deleteTitle")}
        description={t("transactions.deleteDescription")}
        cancelLabel={t("transactions.cancel")}
        confirmLabel={t("transactions.delete")}
        pendingLabel={t("transactions.deleting")}
        details={
          deleteDialogTransaction ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm">
              <p className="font-medium">
                {categoryRows.get(deleteDialogTransaction.categoryId)?.name ??
                  t("common.category")}
                {" - "}
                {formatCurrency(deleteDialogTransaction.amount)}
              </p>

              <p className="mt-1 text-muted-foreground">
                {formatDate(
                  deleteDialogTransaction.createdAt,
                  dateLocale,
                )}
              </p>
            </div>
          ) : null
        }
        onConfirm={async () => {
          if (!deleteDialogTransaction) {
            return;
          }

          return deleteMutation.mutateAsync(
            deleteDialogTransaction!.id,
          );
        }}
      />
    </div>
  );
}
