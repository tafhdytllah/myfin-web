"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createAccount,
  getAccounts,
  updateAccount,
} from "@/features/accounts/api/accounts-api";
import {
  Account,
  AccountListFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account-types";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export const accountsKeys = {
  all: ["accounts"] as const,
  list: (filters: AccountListFilters) => ["accounts", "list", filters] as const,
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function useAccounts(filters: AccountListFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: accountsKeys.list(filters),
    queryFn: () => getAccounts(accessToken as string, filters),
    enabled: Boolean(accessToken),
  });
}

export function useCreateAccount() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: CreateAccountPayload;
      onSuccess?: () => void;
    }) => createAccount(accessToken as string, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: accountsKeys.all });
      toast.success(t("accounts.createSuccess"));
      variables.onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("accounts.createError")));
    },
  });
}

export function useUpdateAccount() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAccountPayload;
      onSuccess?: () => void;
    }) => updateAccount(accessToken as string, id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: accountsKeys.all });
      toast.success(t("accounts.updateSuccess"));
      variables.onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("accounts.updateError")));
    },
  });
}

export function useToggleAccountStatus() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      account,
      active,
    }: {
      account: Account;
      active: boolean;
      onSuccess?: () => void;
    }) =>
      updateAccount(accessToken as string, account.id, {
        name: account.name,
        active,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: accountsKeys.all });
      toast.success(
        variables.active
          ? t("accounts.activateSuccess")
          : t("accounts.deactivateSuccess"),
      );
      variables.onSuccess?.();
    },
    onError: (error, variables) => {
      toast.error(
        getApiErrorMessage(
          error,
          variables.active
            ? t("accounts.activateError")
            : t("accounts.deactivateError"),
        ),
      );
    },
  });
}
