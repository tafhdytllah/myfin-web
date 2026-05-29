import { buildTransactionQuery } from "@/features/transactions/api/transaction-query";
import {
  ApiEnvelope,
  CreateTransactionPayload,
  Transaction,
  TransactionListEnvelope,
  TransactionListFilters,
  TransactionSummary
} from "@/features/transactions/types/transaction.types";
import { apiRequest } from "@/lib/api/client";

export const transactionApi = {

  async createTransaction(accessToken: string, payload: CreateTransactionPayload): Promise<Transaction> {
    const response = await apiRequest<ApiEnvelope<Transaction>>("/api/v1/transactions", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async getTransactions(accessToken: string, filters: TransactionListFilters): Promise<TransactionListEnvelope> {
    const response = await apiRequest<ApiEnvelope<Transaction[]>>(`/api/v1/transactions?${buildTransactionQuery(filters)}`, {
      method: "GET",
      accessToken,
    });

    return response;
  },

  async getTransaction(accessToken: string, id: string): Promise<Transaction> {
    const response = await apiRequest<ApiEnvelope<Transaction>>(`/api/v1/transactions/${id}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async getTransactionSummary(accessToken: string, accountId: string): Promise<TransactionSummary> {
    const response = await apiRequest<ApiEnvelope<TransactionSummary>>(`/api/v1/transactions/summary?accountId=${accountId}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  deleteTransaction(accessToken: string, id: string): Promise<void> {
    return apiRequest<ApiEnvelope<null>>(`/api/v1/transactions/${id}`, {
      method: "DELETE",
      accessToken,
    }).then(() => { });
  },
};
