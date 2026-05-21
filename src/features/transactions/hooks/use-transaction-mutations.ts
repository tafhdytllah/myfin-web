"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { transactionsKeys } from "@/features/transactions/hooks/transaction-query-keys";
import { transactionService } from "@/features/transactions/services/transaction.service";
import { CreateTransactionPayload } from "@/features/transactions/types/transaction.types";
import { getApiErrorMessage } from "@/lib/errors/get-api-error-message";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export function useCreateTransaction() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: CreateTransactionPayload;
      onSuccess?: () => void;
    }) => transactionService.createTransaction(accessToken as string, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(t("transactions.createSuccess"));
      variables.onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("transactions.createError")));
    },
  });
}

export function useDeleteTransaction() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
      onSuccess?: () => void;
    }) => transactionService.deleteTransaction(accessToken as string, id),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(t("transactions.deleteSuccess"));
      variables.onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("transactions.deleteError")));
    },
  });
}
