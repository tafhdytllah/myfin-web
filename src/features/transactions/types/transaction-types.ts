import { CategoryType } from "@/features/categories/types/category-types";

export type ApiEnvelope<T> = {
  data: T;
  message?: string;
  meta?: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: CategoryType;
  description: string;
  createdAt: string;
};

export type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type TransactionFilters = {
  keyword?: string;
  accountId?: string;
  type?: "all" | CategoryType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
};

export type CreateTransactionPayload = {
  accountId: string;
  categoryId: string;
  amount: number;
  type: CategoryType;
  description?: string;
};
