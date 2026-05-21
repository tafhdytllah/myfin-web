"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { transactionsKeys } from "@/features/transactions/hooks/transaction-query-keys";
import { transactionService } from "@/features/transactions/services/transaction.service";
import {
  Transaction,
  TransactionFilters,
} from "@/features/transactions/types/transaction.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export function useTransactions(filters: TransactionFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: transactionsKeys.list(filters),
    queryFn: () => transactionService.getTransactions(accessToken as string, filters),
    enabled: Boolean(accessToken),
  });
}

export function useTransaction(id?: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: transactionsKeys.detail(id as string),
    queryFn: () => transactionService.getTransaction(accessToken as string, id as string),
    enabled: Boolean(accessToken && id),
  });
}

export function useEditTransactionUnavailable() {
  const { t } = useTranslations();

  return (transaction: Transaction) => {
    toast.warning(t("transactions.editUnavailable", { id: transaction.id }));
  };
}
