"use client";

import { accountsKeys } from "@/features/accounts/hooks/account-query-keys";
import { accountService } from "@/features/accounts/services/account.service";
import {
  CreateAccountRequest,
  UpdateAccountRequest,
  UpdateStatusAccountRequest
} from "@/features/accounts/types/account.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateAccount() {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: CreateAccountRequest) =>
      accountService.createAccount(
        accessToken as string,
        payload
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: accountsKeys.lists(),
      });
      toast.success(t("accounts.createSuccess"));
    },
  });
}

export function useUpdateAccount() {
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
      payload: UpdateAccountRequest;
    }) =>
      accountService.updateAccount(
        accessToken as string,
        id,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: accountsKeys.lists(),
      });
      toast.success(t("accounts.updateSuccess"));
    },
  });
}

export function useToggleAccountStatus(
  onSuccess?: () => void
) {
  const { t } = useTranslations();
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStatusAccountRequest;
    }) => {
      if (!accessToken) {
        throw new Error("Unauthorized");
      }

      return await accountService.updateStatusAccount(
        accessToken,
        id,
        payload
      );
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: accountsKeys.lists(),
      });

      toast.success(
        variables.payload.active
          ? t("accounts.activateSuccess")
          : t("accounts.deactivateSuccess"),
      );

      if (onSuccess) {
        onSuccess();
      }
    },
  });
}
