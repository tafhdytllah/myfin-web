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
import { useTranslations } from "@/lib/i18n/use-translations";

const categories = [
  { name: "Food", type: "EXPENSE", active: true, used: 12 },
  { name: "Salary", type: "INCOME", active: true, used: 4 },
  { name: "Old Reimbursements", type: "INCOME", active: false, used: 2 },
];

export function CategoriesPageView() {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("categories.title")}
        description={t("categories.description")}
        action={
          <Button className="h-11 rounded-2xl bg-[var(--color-surface-sidebar)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-surface-sidebar)]/95">
            {t("categories.addCategory")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: t("categories.total"), value: "10" },
          { label: t("common.active"), value: "8" },
          { label: t("common.inactive"), value: "2" },
          { label: t("common.income"), value: "4" },
          { label: t("common.expense"), value: "6" },
        ].map((item) => (
          <SectionCard key={item.label} title={item.label}>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">
              {item.value}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title={t("categories.searchTitle")}
        description={t("categories.searchDescription")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[t("common.search"), t("common.type"), t("common.status")].map((item) => (
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
        title={t("categories.tableTitle")}
        description={t("categories.tableDescription")}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.category")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.type")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.status")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.used")}</TableHead>
              <TableHead className="text-[var(--color-foreground-muted)]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((row) => (
              <TableRow
                key={row.name}
                className="bg-[var(--color-surface)] text-[var(--color-foreground)]"
              >
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <StatusBadge tone={row.type === "INCOME" ? "income" : "expense"}>
                    {t(row.type === "INCOME" ? "common.income" : "common.expense")}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={row.active ? "active" : "inactive"}>
                    {row.active ? t("common.active") : t("common.inactive")}
                  </StatusBadge>
                </TableCell>
                <TableCell>{row.used}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-sm" />}
                      aria-label="Open category actions"
                    >
                      <span className="text-lg leading-none">•••</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>{t("common.edit")}</DropdownMenuItem>
                      <DropdownMenuItem>
                        {row.active ? t("common.deactivate") : t("common.activate")}
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
