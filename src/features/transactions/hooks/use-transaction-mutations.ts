"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accountsKeys } from "@/features/accounts/hooks/account-query-keys";
import { dashboardKeys } from "@/features/dashboard/hooks/dashboard-query-keys";
import { transactionsKeys } from "@/features/transactions/hooks/transaction-query-keys";
import { transactionService } from "@/features/transactions/services/transaction.service";
import { CreateTransactionRequest, UpdateTransactionRequest } from "@/features/transactions/types/transaction.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";
import { categoriesKeys } from "@/features/categories/hooks/category-query-keys";

export function useCreateTransaction() {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: CreateTransactionRequest) =>
      transactionService.createTransaction(
        accessToken as string,
        payload
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: transactionsKeys.lists()
      });
      await queryClient.invalidateQueries({
        queryKey: ["dashboard"]
      });
      toast.success(t("transactions.createSuccess"));
    },
  });
}

export function useUpdateTransaction() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: UpdateTransactionRequest;
      }) =>
        transactionService.updateTransaction(
          accessToken as string,
          id,
          payload,
        ),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: transactionsKeys.lists(),
        });
        toast.success(t("transactions.updateSuccess"));
      },
    });
}

export function useDeleteTransaction(
  onSuccess?: () => void
) {
  const { t } = useTranslations();
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!accessToken) {
        throw new Error("Unauthorized");
      }

      return await transactionService.deleteTransaction(
        accessToken, id
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: transactionsKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: dashboardKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: accountsKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: categoriesKeys.all,
        }),
      ]);

      toast.success(t("transactions.deleteSuccess"));

      if (onSuccess) {
        onSuccess();
      }
    },
  });
}
