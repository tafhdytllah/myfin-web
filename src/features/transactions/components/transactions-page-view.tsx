"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PencilLine, RotateCcw, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { TransactionDeleteDialog } from "@/features/transactions/components/transaction-delete-dialog";
import { TransactionFormDialog } from "@/features/transactions/components/transaction-form-dialog";
import {
  useEditTransactionUnavailable,
  useTransactions,
} from "@/features/transactions/hooks/use-transaction-queries";
import { Transaction } from "@/features/transactions/types/transaction-types";
import {
  buildTransactionSearchParams,
  parseTransactionFilters,
} from "@/features/transactions/utils/transaction-search-params";
import { ActionMenuTrigger } from "@/components/shared/action-menu-trigger";
import { PageHeader } from "@/components/shared/page-header";
import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { SectionCard } from "@/components/shared/section-card";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { SummaryStatCard } from "@/components/shared/summary-stat-card";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const summaryListQuery = useTransactions({
    ...filters,
    page: 1,
    size: 1000,
  });

  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const transactionsEnvelope = transactionsQuery.data;
  const transactions = useMemo(
    () => transactionsEnvelope?.data ?? [],
    [transactionsEnvelope?.data],
  );
  const summaryTransactions = useMemo(
    () => summaryListQuery.data?.data ?? [],
    [summaryListQuery.data?.data],
  );

  const summary = useMemo(() => {
    const totalIncome = summaryTransactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpense = summaryTransactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      totalTransactions: summaryListQuery.data?.meta?.totalElements ?? 0,
      totalIncome,
      totalExpense,
    };
  }, [summaryListQuery.data?.meta?.totalElements, summaryTransactions]);

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
      <PageHeader
        title={t("transactions.title")}
        description={t("transactions.description")}
        action={
          <Button
            className="h-11 rounded-2xl px-5 text-sm font-semibold max-sm:w-full"
            onClick={() => setFormOpen(true)}
          >
            {t("transactions.addTransaction")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: t("transactions.totalTransactions"),
            value: String(summary.totalTransactions),
          },
          { label: t("common.income"), value: formatCurrency(summary.totalIncome) },
          { label: t("common.expense"), value: formatCurrency(summary.totalExpense) },
        ].map((item) => (
          <SummaryStatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <SectionCard
        title={t("transactions.filtersTitle")}
        description={t("transactions.filtersDescription")}
        action={
          hasActiveFilters ? (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={resetFilters}
            >
              <RotateCcw className="size-4" />
              {t("transactions.resetFilters")}
            </Button>
          ) : null
        }
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={t("common.search")}
          />

          <Select
            value={filters.accountId || "all"}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                accountId: value === "all" || value == null ? "" : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.account")}>
                {filters.accountId ? selectedAccountName : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("transactions.allAccounts")}</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.type ?? "all"}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                type: (value ?? "all") as "all" | "INCOME" | "EXPENSE",
                categoryId: "",
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.type")}>
                {selectedTypeLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("transactions.allTypes")}</SelectItem>
              <SelectItem value="INCOME">{t("common.income")}</SelectItem>
              <SelectItem value="EXPENSE">{t("common.expense")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.categoryId || "all"}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                categoryId: value === "all" || value == null ? "" : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.category")}>
                {filters.categoryId ? selectedCategoryName : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("transactions.allCategories")}</SelectItem>
              {getCategoryOptions().map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(event) =>
                updateFilters({
                  ...filters,
                  startDate: event.target.value,
                  page: 1,
                })
              }
            />
            <Input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(event) =>
                updateFilters({
                  ...filters,
                  endDate: event.target.value,
                  page: 1,
                })
              }
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={t("transactions.tableTitle")}
        description={t("transactions.tableDescription")}
      >
        {transactionsQuery.isLoading ? (
          <StackSkeleton count={5} itemClassName="h-14 rounded-xl bg-muted" />
        ) : null}

        {transactionsQuery.isError ? (
          <InlineRetryState
            description={t("transactions.loadErrorDescription")}
            retryLabel={t("transactions.retry")}
            onRetry={() => transactionsQuery.refetch()}
          />
        ) : null}

        {!transactionsQuery.isLoading &&
        !transactionsQuery.isError &&
        rows.length === 0 ? (
          <SectionEmptyState
            description={t("transactions.emptyDescription")}
            actions={[
              {
                label: t("transactions.addTransaction"),
                onClick: () => setFormOpen(true),
              },
              ...(hasActiveFilters
                ? [
                    {
                      label: t("transactions.resetFilters"),
                      onClick: resetFilters,
                      variant: "outline" as const,
                    },
                  ]
                : []),
            ]}
          />
        ) : null}

        {!transactionsQuery.isLoading &&
        !transactionsQuery.isError &&
        rows.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[860px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[var(--color-foreground-muted)]">
                      {t("common.date")}
                    </TableHead>
                    <TableHead className="text-[var(--color-foreground-muted)]">
                      {t("common.type")}
                    </TableHead>
                    <TableHead className="text-[var(--color-foreground-muted)]">
                      {t("common.account")}
                    </TableHead>
                    <TableHead className="text-[var(--color-foreground-muted)]">
                      {t("common.category")}
                    </TableHead>
                    <TableHead className="text-[var(--color-foreground-muted)]">
                      {t("common.description")}
                    </TableHead>
                    <TableHead className="text-[var(--color-foreground-muted)]">
                      {t("common.amount")}
                    </TableHead>
                    <TableHead className="text-right text-[var(--color-foreground-muted)]">
                      {t("common.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.createdAt, dateLocale)}</TableCell>
                      <TableCell>
                        <StatusBadge tone={row.type === "INCOME" ? "income" : "expense"}>
                          {row.type === "INCOME"
                            ? t("common.income")
                            : t("common.expense")}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{row.accountName}</TableCell>
                      <TableCell>{row.categoryName}</TableCell>
                      <TableCell className="max-w-xs truncate text-[var(--color-foreground-muted)]">
                        {row.description || "-"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(row.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <ActionMenuTrigger srLabel={t("common.actions")} />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => notifyEditUnavailable(row)}>
                              <PencilLine className="size-4" />
                              {t("transactions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeletingTransaction(row)}
                            >
                              <Trash2 className="size-4" />
                              {t("transactions.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 ? (
              <Pagination className="mt-6 justify-center md:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text={t("transactions.previous")}
                      onClick={(event) => {
                        event.preventDefault();
                        if (currentPage > 1) changePage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
                            changePage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      text={t("transactions.next")}
                      onClick={(event) => {
                        event.preventDefault();
                        if (currentPage < totalPages) changePage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </>
        ) : null}
      </SectionCard>

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
