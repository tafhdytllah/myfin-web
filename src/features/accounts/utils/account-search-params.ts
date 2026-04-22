import { AccountListFilters } from "@/features/accounts/types/account-types";

export const accountStatusOptions = ["all", "active", "inactive"] as const;

export function parseAccountFilters(searchParams: URLSearchParams): AccountListFilters {
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const statusValue = searchParams.get("status");
  const status = accountStatusOptions.includes(
    statusValue as (typeof accountStatusOptions)[number],
  )
    ? (statusValue as AccountListFilters["status"])
    : "all";

  return {
    keyword,
    status,
  };
}

export function buildAccountSearchParams(filters: AccountListFilters) {
  const params = new URLSearchParams();

  if (filters.keyword) {
    params.set("keyword", filters.keyword);
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  return params;
}
