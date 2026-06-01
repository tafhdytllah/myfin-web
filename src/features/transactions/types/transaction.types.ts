import { CategoryType } from "@/features/categories/types/category.types";

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

export type TransactionListFilters = {
  keyword?: string;
  accountId?: string;
  type?: "all" | CategoryType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
};

export type CreateTransactionRequest = {
  accountId: string;
  categoryId: string;
  amount: number;
  type: CategoryType;
  description?: string;
};
