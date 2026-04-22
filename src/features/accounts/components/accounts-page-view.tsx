import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/formatters/currency";

const accounts = [
  { name: "BCA Payroll", balance: 9200000, active: true, usageCount: 18 },
  { name: "Main Wallet", balance: 1850000, active: true, usageCount: 12 },
  { name: "Old Wallet", balance: 0, active: false, usageCount: 4 },
];

export function AccountsPageView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description="Manage active and inactive money sources without losing historical transactions."
        action={
          <button
            type="button"
            className="rounded-2xl bg-[var(--color-surface-sidebar)] px-5 py-3 text-sm font-semibold text-white"
          >
            Add Account
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Accounts", value: "3" },
          { label: "Active", value: "2" },
          { label: "Inactive", value: "1" },
        ].map((item) => (
          <SectionCard key={item.label} title={item.label}>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">
              {item.value}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title="Search & Status"
        description="Search and active-state filters will connect here once the API layer is wired."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {["Search by account name", "Status filter"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-dashed border-[var(--color-border-strong)] px-4 py-5 text-sm text-[var(--color-foreground-muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <SectionCard
            key={account.name}
            title={account.name}
            action={
              <StatusBadge tone={account.active ? "active" : "inactive"}>
                {account.active ? "Active" : "Inactive"}
              </StatusBadge>
            }
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
              Current Balance
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-foreground)]">
              {formatCurrency(account.balance)}
            </p>
            <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
              Used in {account.usageCount} transactions
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)]"
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)]"
              >
                {account.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
