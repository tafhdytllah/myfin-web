"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { useTranslations } from "@/lib/i18n/use-translations";

const summaryCards = [
  { key: "common.income", value: 22000000, tone: "income" as const },
  { key: "common.expense", value: 9500000, tone: "expense" as const },
  { key: "common.balance", value: 12500000, tone: "active" as const },
];

const transactions = [
  {
    category: "Groceries",
    account: "Main Wallet",
    amount: 185000,
    date: "2026-04-22",
    tone: "expense" as const,
    typeKey: "common.expense",
  },
  {
    category: "Salary",
    account: "BCA Payroll",
    amount: 8750000,
    date: "2026-04-21",
    tone: "income" as const,
    typeKey: "common.income",
  },
];

const accounts = [
  { name: "BCA Payroll", balance: 9200000, used: 18 },
  { name: "Main Wallet", balance: 1850000, used: 12 },
  { name: "GoPay", balance: 750000, used: 6 },
];

export function DashboardPageView() {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.title", { username: "demo" })}
        description={t("dashboard.description", {
          date: formatDate("2026-04-22"),
        })}
        action={
          <Button className="h-11 rounded-2xl bg-[var(--color-surface-sidebar)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-surface-sidebar)]/95">
            {t("dashboard.addTransaction")}
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <SectionCard
            key={card.key}
            title={t(card.key)}
            description={t("dashboard.summaryDescription")}
          >
            <div className="flex items-end justify-between">
              <p className="text-3xl font-semibold text-[var(--color-foreground)]">
                {formatCurrency(card.value)}
              </p>
              <StatusBadge tone={card.tone}>{t(card.key)}</StatusBadge>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <SectionCard
          title={t("dashboard.recentTransactions")}
          description={t("dashboard.recentDescription")}
          action={
            <Button variant="outline" className="rounded-full border-[var(--color-border-strong)]">
              {t("common.viewAll")}
            </Button>
          }
        >
          <div className="space-y-4">
            {transactions.map((item) => (
              <Card
                key={`${item.category}-${item.date}`}
                className="rounded-3xl border-[var(--color-border)] bg-[var(--color-surface)] py-0 text-left transition hover:bg-muted/60"
              >
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-[var(--color-foreground)]">
                      {item.category}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
                      {item.account} • {formatDate(item.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge tone={item.tone}>{t(item.typeKey)}</StatusBadge>
                    <p className="mt-2 font-semibold text-[var(--color-foreground)]">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={t("dashboard.topAccounts")}
          description={t("dashboard.topAccountsDescription")}
          action={
            <Button variant="outline" className="rounded-full border-[var(--color-border-strong)]">
              {t("common.seeAll")}
            </Button>
          }
        >
          <div className="space-y-4">
            {accounts.map((item) => (
              <Card
                key={item.name}
                className="rounded-3xl border-[var(--color-border)] bg-[var(--color-surface)] py-0"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[var(--color-foreground)]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
                        {t("dashboard.usedTransactions", { count: item.used })}
                      </p>
                    </div>
                    <StatusBadge tone="active">{t("common.active")}</StatusBadge>
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-[var(--color-foreground)]">
                    {formatCurrency(item.balance)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
