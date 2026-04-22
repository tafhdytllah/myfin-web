"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters/currency";
import { useTranslations } from "@/lib/i18n/use-translations";

const accounts = [
  { name: "BCA Payroll", balance: 9200000, active: true, usageCount: 18 },
  { name: "Main Wallet", balance: 1850000, active: true, usageCount: 12 },
  { name: "Old Wallet", balance: 0, active: false, usageCount: 4 },
];

export function AccountsPageView() {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("accounts.title")}
        description={t("accounts.description")}
        action={
          <Button className="h-11 rounded-2xl bg-[var(--color-surface-sidebar)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-surface-sidebar)]/95">
            {t("accounts.addAccount")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t("accounts.totalAccounts"), value: "3" },
          { label: t("common.active"), value: "2" },
          { label: t("common.inactive"), value: "1" },
        ].map((item) => (
          <SectionCard key={item.label} title={item.label}>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">
              {item.value}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title={t("accounts.searchTitle")}
        description={t("accounts.searchDescription")}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[t("accounts.searchPlaceholder"), t("accounts.statusFilter")].map((item) => (
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
                {account.active ? t("common.active") : t("common.inactive")}
              </StatusBadge>
            }
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
              {t("accounts.currentBalance")}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-foreground)]">
              {formatCurrency(account.balance)}
            </p>
            <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
              {t("accounts.usedTransactions", { count: account.usageCount })}
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="rounded-full border-[var(--color-border-strong)]">
                {t("common.edit")}
              </Button>
              <Button variant="outline" className="rounded-full border-[var(--color-border-strong)]">
                {account.active ? t("common.deactivate") : t("common.activate")}
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
