import { CategoryType } from "@/features/categories/types/category.types";

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

export type DashboardSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type DashboardTransaction = {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: CategoryType;
  description: string;
  createdAt: string;
};
