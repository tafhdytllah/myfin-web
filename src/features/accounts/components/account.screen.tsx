"use client";

import { ConfirmActionDialog } from "@/components/confirm-action-dialog";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { PageActionButton } from "@/components/page-action-button";
import { AccountFormDialog } from "@/features/accounts/components/account-form.dialog";
import { AccountGridSection } from "@/features/accounts/components/account-grid.section";
import { AccountMainSection } from "@/features/accounts/components/account-main.section";
import { useToggleAccountStatus } from "@/features/accounts/hooks/use-account-mutations";
import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { Account } from "@/features/accounts/types/account.types";
import {
  buildAccountSearchParams,
  parseAccountFilters,
} from "@/features/accounts/utils/account-search-params";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCurrency } from "@/lib/formatters/currency";
import { useTranslations } from "@/lib/i18n/use-translations";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export function AccountScreen() {
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
      <AccountMainSection
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
        keyword={keyword}
        onKeywordChange={setKeyword}
        statusValue={filters.status ?? "all"}
        statusDisplayValue={selectedStatusLabel}
        onStatusChange={(value) =>
          updateFilters({
            ...filters,
            status: value as "all" | "active" | "inactive",
          })
        }
        action={
          <PageActionButton onClick={openCreateDialog}>
            <Plus className="size-4" />
            {t("accounts.addAccount")}
          </PageActionButton>
        }
      />

      <AccountGridSection
        loading={accountsQuery.isLoading}
        isError={accountsQuery.isError}
        items={accounts}
        onRetry={() => accountsQuery.refetch()}
        formatCurrency={formatCurrency}
        activatingPending={toggleStatusMutation.isPending}
        onEdit={openEditDialog}
        onDeactivate={setStatusDialogAccount}
        onActivate={(account) =>
          toggleStatusMutation.mutate({
            id: account.id,
            payload: {
              active: true,
            },
          })
        }
      />

      <AccountFormDialog
        account={editingAccount}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <ConfirmActionDialog
        open={Boolean(statusDialogAccount)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusDialogAccount(null);
          }
        }}
        pending={toggleStatusMutation.isPending}
        title={t("accounts.deactivateTitle")}
        description={
          statusDialogAccount
            ? t("accounts.deactivateDescription", { name: statusDialogAccount?.name, })
            : ""
        }
        hint={t("accounts.deactivateHistoryHint")}
        cancelLabel={t("accounts.cancel")}
        confirmLabel={t("common.deactivate")}
        pendingLabel={t("accounts.saving")}
        onConfirm={async () => {
          if (!statusDialogAccount) {
            return;
          }

          try {
            await toggleStatusMutation.mutateAsync({
              id: statusDialogAccount.id,
              payload: {
                active: false,
              }
            });

            setStatusDialogAccount(null);

          } catch {
            setStatusDialogAccount(null);
          }
        }}
      />
    </div>
  );
}
