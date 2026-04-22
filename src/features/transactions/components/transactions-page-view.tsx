import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

const rows = [
  {
    date: "2026-04-22",
    type: "EXPENSE",
    account: "Main Wallet",
    category: "Groceries",
    description: "Weekend groceries",
    amount: 185000,
  },
  {
    date: "2026-04-21",
    type: "INCOME",
    account: "BCA Payroll",
    category: "Salary",
    description: "Monthly salary",
    amount: 8750000,
  },
];

export function TransactionsPageView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Track, filter, and manage your complete cash flow history."
        action={
          <button
            type="button"
            className="rounded-2xl bg-[var(--color-surface-sidebar)] px-5 py-3 text-sm font-semibold text-white"
          >
            Add Transaction
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Transactions", value: "25" },
          { label: "Income", value: formatCurrency(22000000) },
          { label: "Expense", value: formatCurrency(9500000) },
        ].map((item) => (
          <SectionCard key={item.label} title={item.label}>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">
              {item.value}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title="Filters"
        description="This area will be connected to query params, debounced search, and filterable summaries."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {["Search", "Account", "Type", "Category", "Date Range"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-dashed border-[var(--color-border-strong)] px-4 py-5 text-sm text-[var(--color-foreground-muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Transaction Table"
        description="Table structure is in place for pagination, actions, and server-side filters."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
            <thead>
              <tr className="text-[var(--color-foreground-muted)]">
                <th className="px-4">Date</th>
                <th className="px-4">Type</th>
                <th className="px-4">Account</th>
                <th className="px-4">Category</th>
                <th className="px-4">Description</th>
                <th className="px-4">Amount</th>
                <th className="px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.account}-${row.date}-${row.amount}`}
                  className="rounded-3xl bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-[var(--shadow-soft)]"
                >
                  <td className="rounded-l-3xl px-4 py-4">{formatDate(row.date)}</td>
                  <td className="px-4 py-4">
                    <StatusBadge tone={row.type === "INCOME" ? "income" : "expense"}>
                      {row.type}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4">{row.account}</td>
                  <td className="px-4 py-4">{row.category}</td>
                  <td className="px-4 py-4 text-[var(--color-foreground-muted)]">
                    {row.description}
                  </td>
                  <td className="px-4 py-4 font-semibold">{formatCurrency(row.amount)}</td>
                  <td className="rounded-r-3xl px-4 py-4">•••</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
