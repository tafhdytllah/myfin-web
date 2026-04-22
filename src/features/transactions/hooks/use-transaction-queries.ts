"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
} from "@/features/transactions/api/transactions-api";
import {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
} from "@/features/transactions/types/transaction-types";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export const transactionsKeys = {
  all: ["transactions"] as const,
  list: (filters: TransactionFilters) => ["transactions", "list", filters] as const,
  detail: (id: string) => ["transactions", "detail", id] as const,
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function useTransactions(filters: TransactionFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: transactionsKeys.list(filters),
    queryFn: () => getTransactions(accessToken as string, filters),
    enabled: Boolean(accessToken),
  });
}

export function useTransaction(id?: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: transactionsKeys.detail(id as string),
    queryFn: () => getTransaction(accessToken as string, id as string),
    enabled: Boolean(accessToken && id),
  });
}

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
    }) => createTransaction(accessToken as string, payload),
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
    }) => deleteTransaction(accessToken as string, id),
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

export function useEditTransactionUnavailable() {
  const { t } = useTranslations();

  return (transaction: Transaction) => {
    toast.warning(t("transactions.editUnavailable", { id: transaction.id }));
  };
}
