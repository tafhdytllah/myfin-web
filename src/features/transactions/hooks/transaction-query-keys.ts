import { TransactionFilters } from "@/features/transactions/types/transaction-types";

export const transactionsKeys = {
  all: ["transactions"] as const,
  list: (filters: TransactionFilters) => ["transactions", "list", filters] as const,
  detail: (id: string) => ["transactions", "detail", id] as const,
};
