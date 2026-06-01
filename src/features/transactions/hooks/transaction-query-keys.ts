import { TransactionListFilters } from "@/features/transactions/types/transaction.types";

export const transactionsKeys = {
  all: ["transactions"] as const,

  lists: () => [...transactionsKeys.all, "list"] as const,

  list: (filters: TransactionListFilters) => [...transactionsKeys.lists(), filters] as const,

  details: () => [...transactionsKeys.all, "detail"] as const,

  detail: (id: string) => [...transactionsKeys.details(), id] as const,
};
