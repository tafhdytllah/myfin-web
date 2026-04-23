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
import { useDeleteTransaction } from "@/features/transactions/hooks/use-transaction-queries";
import { Transaction } from "@/features/transactions/types/transaction-types";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useLocaleStore } from "@/stores/locale-store";

type TransactionDeleteDialogProps = {
  transaction: Transaction | null;
  categoryName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TransactionDeleteDialog({
  transaction,
  categoryName,
  open,
  onOpenChange,
}: TransactionDeleteDialogProps) {
  const { t } = useTranslations();
  const locale = useLocaleStore((state) => state.locale);
  const deleteMutation = useDeleteTransaction();

  if (!transaction) {
    return null;
  }

  const dateLocale = locale === "id" ? "id-ID" : "en-US";
  const handleOpenChange = (nextOpen: boolean) => {
    if (deleteMutation.isPending) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("transactions.deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("transactions.deleteDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm">
          <p className="font-medium">
            {categoryName ?? t("common.category")} {" - "} {formatCurrency(transaction.amount)}
          </p>
          <p className="mt-1 text-muted-foreground">
            {formatDate(transaction.createdAt, dateLocale)}
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            {t("transactions.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              deleteMutation.mutate(
                {
                  id: transaction.id,
                  onSuccess: () => onOpenChange(false),
                },
                {
                  onError: () => onOpenChange(false),
                },
              );
            }}
          >
            {deleteMutation.isPending ? t("transactions.deleting") : t("transactions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
