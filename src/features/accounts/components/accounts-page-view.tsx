"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PencilLine, Power, PowerOff, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AccountFormDialog } from "@/features/accounts/components/account-form-dialog";
import { AccountStatusDialog } from "@/features/accounts/components/account-status-dialog";
import { Account } from "@/features/accounts/types/account-types";
import {
  useAccounts,
  useToggleAccountStatus,
} from "@/features/accounts/hooks/use-account-queries";
import {
  buildAccountSearchParams,
  parseAccountFilters,
} from "@/features/accounts/utils/account-search-params";
import { ActionMenuTrigger } from "@/components/shared/action-menu-trigger";
import { EmptySectionCard } from "@/components/shared/empty-section-card";
import { PageHeader } from "@/components/shared/page-header";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { SummaryStatCard } from "@/components/shared/summary-stat-card";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters/currency";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTranslations } from "@/lib/i18n/use-translations";

export function AccountsPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslations();
  const filters = useMemo(
    () => parseAccountFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const accountsQuery = useAccounts(filters);
  const toggleStatusMutation = useToggleAccountStatus();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [statusDialogAccount, setStatusDialogAccount] = useState<Account | null>(null);
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  const debouncedKeyword = useDebouncedValue(keyword);

  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);
  const hasActiveFilters = Boolean(filters.keyword || filters.status !== "all");
  const selectedStatusLabel = useMemo(() => {
    switch (filters.status) {
      case "active":
        return t("common.active");
      case "inactive":
        return t("common.inactive");
      default:
        return t("accounts.statusAll");
    }
  }, [filters.status, t]);
  const modalTrail = useMemo(() => {
    if (statusDialogAccount) {
      return t("common.deactivate");
    }

    if (formOpen && editingAccount) {
      return t("common.edit");
    }

    if (formOpen) {
      return t("common.create");
    }

    return null;
  }, [editingAccount, formOpen, statusDialogAccount, t]);

  usePageTrail([modalTrail]);

  const summary = useMemo(
    () => ({
      total: accounts.length,
      active: accounts.filter((account) => account.active).length,
      inactive: accounts.filter((account) => !account.active).length,
    }),
    [accounts],
  );

  const updateFilters = useCallback((nextFilters: typeof filters) => {
    const params = buildAccountSearchParams(nextFilters);
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    if (debouncedKeyword === (filters.keyword ?? "")) {
      return;
    }

    updateFilters({
      ...filters,
      keyword: debouncedKeyword,
    });
  }, [debouncedKeyword, filters, updateFilters]);

  function openCreateDialog() {
    setEditingAccount(null);
    setFormOpen(true);
  }

  function openEditDialog(account: Account) {
    setEditingAccount(account);
    setFormOpen(true);
  }

  function resetFilters() {
    setKeyword("");
    updateFilters({
      keyword: "",
      status: "all",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("accounts.title")}
        description={t("accounts.description")}
        action={
          <Button
            className="h-11 rounded-2xl px-5 text-sm font-semibold max-sm:w-full"
            onClick={openCreateDialog}
          >
            {t("accounts.addAccount")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t("accounts.totalAccounts"), value: String(summary.total) },
          { label: t("common.active"), value: String(summary.active) },
          { label: t("common.inactive"), value: String(summary.inactive) },
        ].map((item) => (
          <SummaryStatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <SectionCard
        title={t("accounts.searchTitle")}
        description={t("accounts.searchDescription")}
        action={
          hasActiveFilters ? (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={resetFilters}
            >
              <RotateCcw className="size-4" />
              {t("accounts.resetFilters")}
            </Button>
          ) : null
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={t("accounts.searchPlaceholder")}
          />
          <Select
            value={filters.status ?? "all"}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                status: value as "all" | "active" | "inactive",
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("accounts.statusFilter")}>
                {selectedStatusLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("accounts.statusAll")}</SelectItem>
              <SelectItem value="active">{t("common.active")}</SelectItem>
              <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      {accountsQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SectionCard key={index} title=" ">
              <StackSkeleton
                count={3}
                itemClassName="h-4 rounded bg-muted"
                className="space-y-3 [&>*:nth-child(2)]:h-10 [&>*:nth-child(2)]:w-40 [&>*:nth-child(1)]:w-24 [&>*:nth-child(3)]:w-32"
              />
            </SectionCard>
          ))}
        </div>
      ) : null}

      {accountsQuery.isError ? (
        <RetryCard
          title={t("accounts.loadErrorTitle")}
          description={t("accounts.loadErrorDescription")}
          retryLabel={t("accounts.retry")}
          onRetry={() => accountsQuery.refetch()}
        />
      ) : null}

      {!accountsQuery.isLoading && !accountsQuery.isError && accounts.length === 0 ? (
        <EmptySectionCard
          title={t("accounts.emptyTitle")}
          description={t("accounts.emptyDescription")}
          actions={[
            {
              label: t("accounts.addAccount"),
              onClick: openCreateDialog,
            },
            ...(hasActiveFilters
              ? [
                  {
                    label: t("accounts.resetFilters"),
                    onClick: resetFilters,
                    variant: "outline" as const,
                  },
                ]
              : []),
          ]}
        />
      ) : null}

      {!accountsQuery.isLoading && !accountsQuery.isError && accounts.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <SectionCard
              key={account.id}
              title={account.name}
              action={
                <div className="flex items-center gap-2">
                  <StatusBadge tone={account.active ? "active" : "inactive"}>
                    {account.active ? t("common.active") : t("common.inactive")}
                  </StatusBadge>
                  <DropdownMenu>
                    <ActionMenuTrigger
                      size="icon"
                      className="rounded-full"
                      srLabel={t("common.actions")}
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(account)}>
                        <PencilLine className="size-4" />
                        {t("common.edit")}
                      </DropdownMenuItem>
                      {account.active ? (
                        <DropdownMenuItem onClick={() => setStatusDialogAccount(account)}>
                          <PowerOff className="size-4" />
                          {t("common.deactivate")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          disabled={toggleStatusMutation.isPending}
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              account,
                              active: true,
                            })
                          }
                        >
                          <Power className="size-4" />
                          {t("common.activate")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
                {t("accounts.currentBalance")}
              </p>
              <p className="mt-3 text-3xl font-semibold text-[var(--color-foreground)]">
                {formatCurrency(account.currentBalance)}
              </p>
              <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
                {t("accounts.usedTransactions", { count: account.usageCount })}
              </p>
              <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
                {t("accounts.openingBalanceValue", {
                  amount: formatCurrency(account.openingBalance),
                })}
              </p>
            </SectionCard>
          ))}
        </div>
      ) : null}

      <AccountFormDialog
        account={editingAccount}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
      <AccountStatusDialog
        account={statusDialogAccount}
        open={Boolean(statusDialogAccount)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusDialogAccount(null);
          }
        }}
      />
    </div>
  );
}
