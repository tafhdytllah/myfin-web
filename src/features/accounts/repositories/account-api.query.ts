import { AccountListFilters } from "@/features/accounts/types/account-types";

export function buildAccountQuery(filters: AccountListFilters) {
  const params = new URLSearchParams();

  if (filters.keyword) {
    params.set("keyword", filters.keyword);
  }

  if (filters.status === "active") {
    params.set("active", "true");
  }

  if (filters.status === "inactive") {
    params.set("active", "false");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
