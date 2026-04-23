import { TransactionFilters } from "@/features/transactions/types/transaction-types";

export function buildTransactionQuery(filters: TransactionFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    size: String(filters.size),
  });

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.accountId) params.set("accountId", filters.accountId);
  if (filters.type && filters.type !== "all") params.set("type", filters.type);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  return params.toString();
}
