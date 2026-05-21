"use client";

import { useQuery } from "@tanstack/react-query";

import { accountsKeys } from "@/features/accounts/hooks/account-query-keys";
import { accountService } from "@/features/accounts/services/account.service";
import { AccountListFilters } from "@/features/accounts/types/account.types";
import { useAuthStore } from "@/stores/auth-store";

export function useAccounts(filters: AccountListFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: accountsKeys.list(filters),
    queryFn: () => accountService.getAccounts(accessToken as string, filters),
    enabled: Boolean(accessToken),
  });
}
