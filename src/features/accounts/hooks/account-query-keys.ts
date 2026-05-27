import { AccountListFilters } from "@/features/accounts/types/account.types";

export const accountsKeys = {
  all: ["accounts"] as const,

  lists: () => [...accountsKeys.all, "list"] as const,

  list: (filters: AccountListFilters) =>
    [...accountsKeys.lists(), filters] as const,

  details: () =>
    [...accountsKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...accountsKeys.details(), id] as const,
};