import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

const summaryCards = [
  { title: "Income", value: 22000000, tone: "income" as const },
  { title: "Expense", value: 9500000, tone: "expense" as const },
  { title: "Balance", value: 12500000, tone: "active" as const },
];

const transactions = [
  {
    category: "Groceries",
    account: "Main Wallet",
    amount: 185000,
    date: "2026-04-22",
    tone: "expense" as const,
    type: "Expense",
  },
  {
    category: "Salary",
    account: "BCA Payroll",
    amount: 8750000,
    date: "2026-04-21",
    tone: "income" as const,
    type: "Income",
  },
];

const accounts = [
  { name: "BCA Payroll", balance: 9200000, used: 18 },
  { name: "Main Wallet", balance: 1850000, used: 12 },
  { name: "GoPay", balance: 750000, used: 6 },
];

export function DashboardPageView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, demo"
        description={`Today is ${formatDate("2026-04-22")}. Keep an eye on your balances and jump into the next transaction quickly.`}
        action={
          <button
            type="button"
            className="rounded-2xl bg-[var(--color-surface-sidebar)] px-5 py-3 text-sm font-semibold text-white"
          >
            Add Transaction
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <SectionCard
            key={card.title}
            title={card.title}
            description="Live summary synced to your current account scope."
          >
            <div className="flex items-end justify-between">
              <p className="text-3xl font-semibold text-[var(--color-foreground)]">
                {formatCurrency(card.value)}
              </p>
              <StatusBadge tone={card.tone}>{card.title}</StatusBadge>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <SectionCard
          title="Recent Transactions"
          description="Your latest account activity at a glance."
          action={
            <button
              type="button"
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)]"
            >
              View all
            </button>
          }
        >
          <div className="space-y-4">
            {transactions.map((item) => (
              <button
                key={`${item.category}-${item.date}`}
                type="button"
                className="flex w-full items-center justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-left"
              >
                <div>
                  <p className="font-medium text-[var(--color-foreground)]">
                    {item.category}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
                    {item.account} • {formatDate(item.date)}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge tone={item.tone}>{item.type}</StatusBadge>
                  <p className="mt-2 font-semibold text-[var(--color-foreground)]">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Top Accounts"
          description="Highest balances across your active accounts."
          action={
            <button
              type="button"
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)]"
            >
              See all
            </button>
          }
        >
          <div className="space-y-4">
            {accounts.map((item) => (
              <div
                key={item.name}
                className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[var(--color-foreground)]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
                      Used in {item.used} transactions
                    </p>
                  </div>
                  <StatusBadge tone="active">Active</StatusBadge>
                </div>
                <p className="mt-4 text-2xl font-semibold text-[var(--color-foreground)]">
                  {formatCurrency(item.balance)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
