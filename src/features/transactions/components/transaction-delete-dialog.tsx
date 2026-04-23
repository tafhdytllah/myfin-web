"use client";

import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
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

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      pending={deleteMutation.isPending}
      title={t("transactions.deleteTitle")}
      description={t("transactions.deleteDescription")}
      cancelLabel={t("transactions.cancel")}
      confirmLabel={t("transactions.delete")}
      pendingLabel={t("transactions.deleting")}
      details={
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm">
          <p className="font-medium">
            {categoryName ?? t("common.category")} {" - "}{" "}
            {formatCurrency(transaction.amount)}
          </p>
          <p className="mt-1 text-muted-foreground">
            {formatDate(transaction.createdAt, dateLocale)}
          </p>
        </div>
      }
      onConfirm={() =>
        deleteMutation.mutate(
          {
            id: transaction.id,
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
