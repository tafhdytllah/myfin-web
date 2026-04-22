import { apiRequest } from "@/lib/api/client";
import {
  ApiEnvelope,
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  TransactionSummary,
} from "@/features/transactions/types/transaction-types";

function buildTransactionQuery(filters: TransactionFilters) {
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

export async function getTransactions(
  accessToken: string,
  filters: TransactionFilters,
) {
  return apiRequest<ApiEnvelope<Transaction[]>>(
    `/api/v1/transactions?${buildTransactionQuery(filters)}`,
    {
      method: "GET",
      accessToken,
    },
  );
}

export async function getTransaction(accessToken: string, id: string) {
  const response = await apiRequest<ApiEnvelope<Transaction>>(
    `/api/v1/transactions/${id}`,
    {
      method: "GET",
      accessToken,
    },
  );

  return response.data;
}

export async function createTransaction(
  accessToken: string,
  payload: CreateTransactionPayload,
) {
  const response = await apiRequest<ApiEnvelope<Transaction>>("/api/v1/transactions", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteTransaction(accessToken: string, id: string) {
  return apiRequest<ApiEnvelope<null>>(`/api/v1/transactions/${id}`, {
    method: "DELETE",
    accessToken,
  });
}

export async function getTransactionSummary(
  accessToken: string,
  accountId: string,
) {
  const response = await apiRequest<ApiEnvelope<TransactionSummary>>(
    `/api/v1/transactions/summary?accountId=${accountId}`,
    {
      method: "GET",
      accessToken,
    },
  );

  return response.data;
}
