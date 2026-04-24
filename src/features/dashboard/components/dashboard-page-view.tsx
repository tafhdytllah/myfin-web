"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { usePageTrail } from "@/components/layout/page-trail-context";
import { DashboardAccountScopeCard } from "@/features/dashboard/components/dashboard-account-scope-card";
import { DashboardRecentTransactionsSection } from "@/features/dashboard/components/dashboard-recent-transactions-section";
import { DashboardSummarySection } from "@/features/dashboard/components/dashboard-summary-section";
import { DashboardTopAccountsSection } from "@/features/dashboard/components/dashboard-top-accounts-section";
import { PageActionButton } from "@/components/shared/page-action-button";
import { PageHeader } from "@/components/shared/page-header";
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

      <DashboardAccountScopeCard
        title={t("dashboard.accountScopeTitle")}
        description={t("dashboard.accountScopeDescription")}
        value={selectedAccountId}
        placeholder={t("dashboard.accountScopePlaceholder")}
        displayValue={selectedAccountName}
        allAccountsLabel={t("dashboard.allAccounts")}
        options={activeAccounts.map((account) => ({
          value: account.id,
          label: account.name,
        }))}
        onValueChange={(value) => setSelectedAccountId(value ?? "all")}
      />

      <DashboardSummarySection
        loading={summaryQuery.isLoading}
        isError={summaryQuery.isError}
        cards={summaryCards.map((card) => ({
          key: card.key,
          label: t(card.key),
          tone: card.tone,
          value: formatCurrency(card.value),
        }))}
        summaryDescription={t("dashboard.summaryDescription")}
        retryTitle={t("dashboard.loadErrorTitle")}
        retryDescription={t("dashboard.loadErrorDescription")}
        retryLabel={t("dashboard.retry")}
        onRetry={() => summaryQuery.refetch()}
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <DashboardRecentTransactionsSection
          title={t("dashboard.recentTransactions")}
          description={t("dashboard.recentDescription")}
          viewAllLabel={t("common.viewAll")}
          viewAllHref={routes.transactions}
          loading={recentTransactionsQuery.isLoading}
          isError={recentTransactionsQuery.isError}
          items={recentTransactions}
          emptyDescription={t("dashboard.recentEmpty")}
          errorDescription={t("dashboard.recentLoadError")}
          retryLabel={t("dashboard.retry")}
          onRetry={() => recentTransactionsQuery.refetch()}
          formatDate={(value) => formatDate(value, dateLocale)}
          formatCurrency={formatCurrency}
          incomeLabel={t("common.income")}
          expenseLabel={t("common.expense")}
        />

        <DashboardTopAccountsSection
          title={t("dashboard.topAccounts")}
          description={t("dashboard.topAccountsDescription")}
          seeAllLabel={t("common.seeAll")}
          seeAllHref={routes.accounts}
          loading={activeAccountsQuery.isLoading}
          isError={activeAccountsQuery.isError}
          items={topAccounts}
          emptyDescription={t("dashboard.topAccountsEmpty")}
          errorDescription={t("dashboard.accountsLoadError")}
          retryLabel={t("dashboard.retry")}
          onRetry={() => activeAccountsQuery.refetch()}
          activeLabel={t("common.active")}
          usedTransactionsLabel={(count) => t("dashboard.usedTransactions", { count })}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
