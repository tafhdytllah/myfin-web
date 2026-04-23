"use client";

import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { Account } from "@/features/accounts/types/account-types";
import { useToggleAccountStatus } from "@/features/accounts/hooks/use-account-queries";
import { useTranslations } from "@/lib/i18n/use-translations";

type AccountStatusDialogProps = {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AccountStatusDialog({
  account,
  open,
  onOpenChange,
}: AccountStatusDialogProps) {
  const { t } = useTranslations();
  const toggleMutation = useToggleAccountStatus();

  if (!account) {
    return null;
  }

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      pending={toggleMutation.isPending}
      title={t("accounts.deactivateTitle")}
      description={t("accounts.deactivateDescription", { name: account.name })}
      hint={t("accounts.deactivateHistoryHint")}
      cancelLabel={t("accounts.cancel")}
      confirmLabel={t("common.deactivate")}
      pendingLabel={t("accounts.saving")}
      onConfirm={() =>
        toggleMutation.mutate(
          {
            account,
            active: false,
            onSuccess: () => onOpenChange(false),
          },
          {
            onError: () => onOpenChange(false),
          },
        )
      }
    />
  );
}
