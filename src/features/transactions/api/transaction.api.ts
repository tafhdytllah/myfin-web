import { buildTransactionQuery } from "@/features/transactions/api/transaction-query";
import {
  ApiEnvelope,
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  TransactionListEnvelope,
  TransactionSummary,
} from "@/features/transactions/types/transaction.types";
import { apiRequest } from "@/lib/api/client";

export const transactionApi = {
  getTransactions(
    accessToken: string,
    filters: TransactionFilters,
  ): Promise<TransactionListEnvelope> {
    return apiRequest<ApiEnvelope<Transaction[]>>(
      `/api/v1/transactions?${buildTransactionQuery(filters)}`,
      {
        method: "GET",
        accessToken,
      },
    ) as Promise<TransactionListEnvelope>;
  },

  async getTransaction(accessToken: string, id: string): Promise<Transaction> {
    const response = await apiRequest<ApiEnvelope<Transaction>>(
      `/api/v1/transactions/${id}`,
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },

  async createTransaction(
    accessToken: string,
    payload: CreateTransactionPayload,
  ): Promise<Transaction> {
    const response = await apiRequest<ApiEnvelope<Transaction>>(
      "/api/v1/transactions",
      {
        method: "POST",
        accessToken,
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async deleteTransaction(accessToken: string, id: string): Promise<void> {
    await apiRequest<ApiEnvelope<null>>(`/api/v1/transactions/${id}`, {
      method: "DELETE",
      accessToken,
    });
  },

  async getTransactionSummary(
    accessToken: string,
    accountId: string,
  ): Promise<TransactionSummary> {
    const response = await apiRequest<ApiEnvelope<TransactionSummary>>(
      `/api/v1/transactions/summary?accountId=${accountId}`,
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },
};
