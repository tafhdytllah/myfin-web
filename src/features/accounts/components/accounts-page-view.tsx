"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AccountsFiltersCard } from "@/features/accounts/components/accounts-filters-card";
import { AccountFormDialog } from "@/features/accounts/components/account-form-dialog";
import { AccountsGridSection } from "@/features/accounts/components/accounts-grid-section";
import { AccountsSummaryCards } from "@/features/accounts/components/accounts-summary-cards";
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
import { PageActionButton } from "@/components/shared/page-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { usePageTrail } from "@/components/layout/page-trail-context";
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
          <PageActionButton onClick={openCreateDialog}>
            {t("accounts.addAccount")}
          </PageActionButton>
        }
      />

      <AccountsSummaryCards
        items={[
          { label: t("accounts.totalAccounts"), value: String(summary.total) },
          { label: t("common.active"), value: String(summary.active) },
          { label: t("common.inactive"), value: String(summary.inactive) },
        ]}
      />

      <AccountsFiltersCard
        title={t("accounts.searchTitle")}
        description={t("accounts.searchDescription")}
        hasActiveFilters={hasActiveFilters}
        resetLabel={t("accounts.resetFilters")}
        onReset={resetFilters}
        keyword={keyword}
        searchPlaceholder={t("accounts.searchPlaceholder")}
        onKeywordChange={setKeyword}
        statusValue={filters.status ?? "all"}
        statusPlaceholder={t("accounts.statusFilter")}
        statusDisplayValue={selectedStatusLabel}
        statusOptions={[
          { value: "all", label: t("accounts.statusAll") },
          { value: "active", label: t("common.active") },
          { value: "inactive", label: t("common.inactive") },
        ]}
        onStatusChange={(value) =>
          updateFilters({
            ...filters,
            status: value as "all" | "active" | "inactive",
          })
        }
      />

      <AccountsGridSection
        loading={accountsQuery.isLoading}
        isError={accountsQuery.isError}
        items={accounts}
        hasActiveFilters={hasActiveFilters}
        retryTitle={t("accounts.loadErrorTitle")}
        retryDescription={t("accounts.loadErrorDescription")}
        retryLabel={t("accounts.retry")}
        onRetry={() => accountsQuery.refetch()}
        emptyTitle={t("accounts.emptyTitle")}
        emptyDescription={t("accounts.emptyDescription")}
        addLabel={t("accounts.addAccount")}
        resetFiltersLabel={t("accounts.resetFilters")}
        onAdd={openCreateDialog}
        onResetFilters={resetFilters}
        labels={{
          active: t("common.active"),
          inactive: t("common.inactive"),
          edit: t("common.edit"),
          activate: t("common.activate"),
          deactivate: t("common.deactivate"),
          actions: t("common.actions"),
          currentBalance: t("accounts.currentBalance"),
          usedTransactions: (count) => t("accounts.usedTransactions", { count }),
          openingBalance: (amount) =>
            t("accounts.openingBalanceValue", {
              amount,
            }),
        }}
        formatCurrency={formatCurrency}
        activatingPending={toggleStatusMutation.isPending}
        onEdit={openEditDialog}
        onDeactivate={setStatusDialogAccount}
        onActivate={(account) =>
          toggleStatusMutation.mutate({
            account,
            active: true,
          })
        }
      />

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
