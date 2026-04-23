"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <Button
            nativeButton={false}
            render={<Link href={routes.transactions} />}
            className="h-11 rounded-2xl px-5 text-sm font-semibold max-sm:w-full"
          >
            {t("dashboard.addTransaction")}
          </Button>
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
              <SelectValue placeholder={t("dashboard.accountScopePlaceholder")} />
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
        <SectionCard
          title={t("dashboard.loadErrorTitle")}
          description={t("dashboard.loadErrorDescription")}
        >
          <Button variant="outline" onClick={() => summaryQuery.refetch()}>
            {t("dashboard.retry")}
          </Button>
        </SectionCard>
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
            <Button
              nativeButton={false}
              render={<Link href={routes.transactions} />}
              variant="outline"
              className="rounded-full max-sm:w-full"
            >
              {t("common.viewAll")}
            </Button>
          }
        >
          {recentTransactionsQuery.isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 rounded-3xl bg-muted" />
              ))}
            </div>
          ) : null}

          {recentTransactionsQuery.isError ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              {t("dashboard.recentLoadError")}
            </div>
          ) : null}

          {!recentTransactionsQuery.isLoading &&
          !recentTransactionsQuery.isError &&
          recentTransactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              {t("dashboard.recentEmpty")}
            </div>
          ) : null}

          {!recentTransactionsQuery.isLoading &&
          !recentTransactionsQuery.isError &&
          recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-3xl border-[var(--color-border)] bg-[var(--color-surface)] py-0 text-left transition hover:bg-muted/60"
                >
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--color-foreground)]">
                        {item.categoryName}
                      </p>
                      <p className="mt-1 truncate text-sm text-[var(--color-foreground-muted)]">
                        {item.accountName} · {formatDate(item.createdAt, dateLocale)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <StatusBadge
                        tone={item.type === "INCOME" ? "income" : "expense"}
                      >
                        {item.type === "INCOME"
                          ? t("common.income")
                          : t("common.expense")}
                      </StatusBadge>
                      <p className="mt-2 font-semibold text-[var(--color-foreground)]">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          title={t("dashboard.topAccounts")}
          description={t("dashboard.topAccountsDescription")}
          action={
            <Button
              nativeButton={false}
              render={<Link href={routes.accounts} />}
              variant="outline"
              className="rounded-full max-sm:w-full"
            >
              {t("common.seeAll")}
            </Button>
          }
        >
          {activeAccountsQuery.isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 rounded-3xl bg-muted" />
              ))}
            </div>
          ) : null}

          {activeAccountsQuery.isError ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              {t("dashboard.accountsLoadError")}
            </div>
          ) : null}

          {!activeAccountsQuery.isLoading &&
          !activeAccountsQuery.isError &&
          topAccounts.length > 0 ? (
            <div className="space-y-4">
              {topAccounts.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-3xl border-[var(--color-border)] bg-[var(--color-surface)] py-0"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[var(--color-foreground)]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
                          {t("dashboard.usedTransactions", { count: item.usageCount })}
                        </p>
                      </div>
                      <StatusBadge tone="active">{t("common.active")}</StatusBadge>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-[var(--color-foreground)]">
                      {formatCurrency(item.currentBalance)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}
