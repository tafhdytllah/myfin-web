import { AccountListFilters } from "@/features/accounts/types/account-types";

export const accountsKeys = {
  all: ["accounts"] as const,
  list: (filters: AccountListFilters) => ["accounts", "list", filters] as const,
};
