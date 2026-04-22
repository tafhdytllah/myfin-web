"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useTranslations } from "@/lib/i18n/use-translations";

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
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("transactions.title")}
        description={t("transactions.description")}
        action={
          <Button className="h-11 rounded-2xl bg-[var(--color-surface-sidebar)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-surface-sidebar)]/95">
            {t("transactions.addTransaction")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t("transactions.totalTransactions"), value: "25" },
          { label: t("common.income"), value: formatCurrency(22000000) },
          { label: t("common.expense"), value: formatCurrency(9500000) },
        ].map((item) => (
          <SectionCard key={item.label} title={item.label}>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">
              {item.value}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title={t("transactions.filtersTitle")}
        description={t("transactions.filtersDescription")}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            t("common.search"),
            t("common.account"),
            t("common.type"),
            t("common.category"),
            t("common.dateRange"),
          ].map((item) => (
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
        title={t("transactions.tableTitle")}
        description={t("transactions.tableDescription")}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.date")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.type")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.account")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.category")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.description")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.amount")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={`${row.account}-${row.date}-${row.amount}`}
                className="bg-[var(--color-surface)] text-[var(--color-foreground)]"
              >
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>
                  <StatusBadge tone={row.type === "INCOME" ? "income" : "expense"}>
                    {t(row.type === "INCOME" ? "common.income" : "common.expense")}
                  </StatusBadge>
                </TableCell>
                <TableCell>{row.account}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell className="text-[var(--color-foreground-muted)]">
                  {row.description}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(row.amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-sm" />}
                      aria-label="Open transaction actions"
                    >
                      <span className="text-lg leading-none">•••</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>{t("transactions.edit")}</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        {t("transactions.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
