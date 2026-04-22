"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("accounts.deactivateTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("accounts.deactivateDescription", { name: account.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          {t("accounts.deactivateHistoryHint")}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("accounts.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              toggleMutation.mutate(
                {
                  account,
                  active: false,
                  onSuccess: () => onOpenChange(false),
                },
                {
                  onError: () => onOpenChange(false),
                },
              );
            }}
          >
            {toggleMutation.isPending ? t("accounts.saving") : t("common.deactivate")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
