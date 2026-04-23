"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accountsKeys } from "@/features/accounts/hooks/account-query-keys";
import { accountService } from "@/features/accounts/services/account-service";
import {
  Account,
  AccountListFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account-types";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export function useAccounts(filters: AccountListFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: accountsKeys.list(filters),
    queryFn: () => accountService.getAccounts(accessToken as string, filters),
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
    }) => accountService.createAccount(accessToken as string, payload),
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
    }) => accountService.updateAccount(accessToken as string, id, payload),
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
      accountService.toggleAccountStatus({
        accessToken: accessToken as string,
        account,
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
