"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { usePageTrail } from "@/components/layout/page-trail-context";
import { ContentCard } from "@/components/shared/content-card";
import { ItemMeta } from "@/components/shared/item-meta";
import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { PageActionButton } from "@/components/shared/page-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import {
  useDashboardSummary,
  useRecentTransactions,
} from "@/features/dashboard/hooks/use-dashboard-queries";
import { routes } from "@/lib/constants/routes";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";
import { useLocaleStore } from "@/stores/locale-store";

export function DashboardPageView() {
  const user = useAuthStore((state) => state.user);
  const locale = useLocaleStore((state) => state.locale);
  const { t } = useTranslations();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  const activeAccountsQuery = useAccounts({ status: "active" });
  const categoriesQuery = useCategories({ status: "all", type: "all" });
  const summaryQuery = useDashboardSummary(
    selectedAccountId === "all" ? undefined : selectedAccountId,
  );
  const recentTransactionsQuery = useRecentTransactions(
    selectedAccountId === "all" ? undefined : selectedAccountId,
  );

  const activeAccounts = useMemo(
    () => activeAccountsQuery.data ?? [],
    [activeAccountsQuery.data],
  );
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const topAccounts = useMemo(
    () =>
      [...activeAccounts]
        .sort((left, right) => right.currentBalance - left.currentBalance)
        .slice(0, 3),
    [activeAccounts],
  );
  const selectedAccountName = useMemo(
    () => activeAccounts.find((account) => account.id === selectedAccountId)?.name,
    [activeAccounts, selectedAccountId],
  );

  const recentTransactions = useMemo(() => {
    const accountsMap = new Map(activeAccounts.map((account) => [account.id, account]));
    const categoriesMap = new Map(categories.map((category) => [category.id, category]));

    return (recentTransactionsQuery.data ?? []).map((transaction) => ({
      ...transaction,
      accountName:
        accountsMap.get(transaction.accountId)?.name ?? t("common.account"),
      categoryName:
        categoriesMap.get(transaction.categoryId)?.name ?? t("common.category"),
    }));
  }, [activeAccounts, categories, recentTransactionsQuery.data, t]);

  const summaryCards = [
    {
      key: "common.income",
      tone: "income" as const,
      value: summaryQuery.data?.totalIncome ?? 0,
    },
    {
      key: "common.expense",
      tone: "expense" as const,
      value: summaryQuery.data?.totalExpense ?? 0,
    },
    {
      key: "common.balance",
      tone: "active" as const,
      value: summaryQuery.data?.balance ?? 0,
    },
  ];

  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  usePageTrail([]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.title", { username: user?.username ?? t("common.guest") })}
        description={t("dashboard.description", {
          date: formatDate(new Date().toISOString(), dateLocale),
        })}
        action={
          <PageActionButton asChild>
            <Link href={routes.transactions}>{t("dashboard.addTransaction")}</Link>
          </PageActionButton>
        }
      />

      <SectionCard
        title={t("dashboard.accountScopeTitle")}
        description={t("dashboard.accountScopeDescription")}
      >
        <div className="max-w-sm">
          <Select
            value={selectedAccountId}
            onValueChange={(value) => setSelectedAccountId(value ?? "all")}
          >
            <SelectTrigger className="h-11 w-full rounded-2xl">
              <SelectValue placeholder={t("dashboard.accountScopePlaceholder")}>
                {selectedAccountId === "all"
                  ? t("dashboard.allAccounts")
                  : selectedAccountName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("dashboard.allAccounts")}</SelectItem>
              {activeAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      {summaryQuery.isLoading ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SectionCard key={index} title=" ">
              <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-10 w-40 rounded bg-muted" />
              </div>
            </SectionCard>
          ))}
        </div>
      ) : null}

      {summaryQuery.isError ? (
        <RetryCard
          title={t("dashboard.loadErrorTitle")}
          description={t("dashboard.loadErrorDescription")}
          retryLabel={t("dashboard.retry")}
          onRetry={() => summaryQuery.refetch()}
        />
      ) : null}

      {!summaryQuery.isLoading && !summaryQuery.isError ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <SectionCard
              key={card.key}
              title={t(card.key)}
              description={t("dashboard.summaryDescription")}
            >
              <div className="flex items-end justify-between gap-4">
                <p className="text-3xl font-semibold text-[var(--color-foreground)]">
                  {formatCurrency(card.value)}
                </p>
                <StatusBadge tone={card.tone}>{t(card.key)}</StatusBadge>
              </div>
            </SectionCard>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <SectionCard
          title={t("dashboard.recentTransactions")}
          description={t("dashboard.recentDescription")}
          action={
            <Button asChild variant="outline" className="rounded-full max-sm:w-full">
              <Link href={routes.transactions}>{t("common.viewAll")}</Link>
            </Button>
          }
        >
          {recentTransactionsQuery.isLoading ? (
            <StackSkeleton
              count={3}
              className="space-y-4"
              itemClassName="h-20 rounded-3xl bg-muted"
            />
          ) : null}

          {recentTransactionsQuery.isError ? (
            <InlineRetryState
              description={t("dashboard.recentLoadError")}
              retryLabel={t("dashboard.retry")}
              onRetry={() => recentTransactionsQuery.refetch()}
            />
          ) : null}

          {!recentTransactionsQuery.isLoading &&
          !recentTransactionsQuery.isError &&
          recentTransactions.length === 0 ? (
            <SectionEmptyState description={t("dashboard.recentEmpty")} dashed />
          ) : null}

          {!recentTransactionsQuery.isLoading &&
          !recentTransactionsQuery.isError &&
          recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((item) => (
                <ContentCard
                  key={item.id}
                  className="text-left transition hover:bg-muted/60"
                  contentClassName="flex items-center justify-between gap-4 p-4"
                >
                  <ItemMeta
                    title={item.categoryName}
                    subtitle={
                      <>
                        {item.accountName} {" - "} {formatDate(item.createdAt, dateLocale)}
                      </>
                    }
                    subtitleClassName="truncate"
                  />
                  <div className="shrink-0 text-right">
                    <StatusBadge tone={item.type === "INCOME" ? "income" : "expense"}>
                      {item.type === "INCOME"
                        ? t("common.income")
                        : t("common.expense")}
                    </StatusBadge>
                    <p className="mt-2 font-semibold text-[var(--color-foreground)]">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                </ContentCard>
              ))}
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          title={t("dashboard.topAccounts")}
          description={t("dashboard.topAccountsDescription")}
          action={
            <Button asChild variant="outline" className="rounded-full max-sm:w-full">
              <Link href={routes.accounts}>{t("common.seeAll")}</Link>
            </Button>
          }
        >
          {activeAccountsQuery.isLoading ? (
            <StackSkeleton
              count={3}
              className="space-y-4"
              itemClassName="h-24 rounded-3xl bg-muted"
            />
          ) : null}

          {activeAccountsQuery.isError ? (
            <InlineRetryState
              description={t("dashboard.accountsLoadError")}
              retryLabel={t("dashboard.retry")}
              onRetry={() => activeAccountsQuery.refetch()}
            />
          ) : null}

          {!activeAccountsQuery.isLoading &&
          !activeAccountsQuery.isError &&
          topAccounts.length === 0 ? (
            <SectionEmptyState description={t("dashboard.topAccountsEmpty")} dashed />
          ) : null}

          {!activeAccountsQuery.isLoading &&
          !activeAccountsQuery.isError &&
          topAccounts.length > 0 ? (
            <div className="space-y-4">
              {topAccounts.map((item) => (
                <ContentCard
                  key={item.id}
                  contentClassName="p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <ItemMeta
                      title={item.name}
                      subtitle={t("dashboard.usedTransactions", {
                        count: item.usageCount,
                      })}
                    />
                    <StatusBadge tone="active">{t("common.active")}</StatusBadge>
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-[var(--color-foreground)]">
                    {formatCurrency(item.currentBalance)}
                  </p>
                </ContentCard>
              ))}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}
