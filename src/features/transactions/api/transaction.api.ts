import { buildTransactionQuery } from "@/features/transactions/api/transaction-query";
import {
  CreateTransactionRequest,
  Transaction,
  TransactionListFilters,
  TransactionSummary,
  UpdateTransactionRequest
} from "@/features/transactions/types/transaction.types";
import { apiRequest } from "@/lib/api/client";
import { ApiResponse } from "@/types/api.types";

export const transactionApi = {

  async createTransaction(accessToken: string, payload: CreateTransactionRequest): Promise<Transaction> {
    const response = await apiRequest<ApiResponse<Transaction>>("/api/v1/transactions", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateTransaction(accessToken: string, id: string, payload: UpdateTransactionRequest): Promise<Transaction> {
    const response = await apiRequest<ApiResponse<Transaction>>(`/api/v1/transactions/${id}`, {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async getTransactions(accessToken: string, filters: TransactionListFilters): Promise<ApiResponse<Transaction[]>> {
    const response = await apiRequest<ApiResponse<Transaction[]>>(`/api/v1/transactions?${buildTransactionQuery(filters)}`, {
      method: "GET",
      accessToken,
    });

    return response;
  },

  async getTransaction(accessToken: string, id: string): Promise<Transaction> {
    const response = await apiRequest<ApiResponse<Transaction>>(`/api/v1/transactions/${id}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async getTransactionSummary(accessToken: string, accountId: string): Promise<TransactionSummary> {
    const response = await apiRequest<ApiResponse<TransactionSummary>>(`/api/v1/transactions/summary?accountId=${accountId}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async deleteTransaction(accessToken: string, id: string): Promise<void> {
    return await apiRequest<ApiResponse<null>>(`/api/v1/transactions/${id}`, {
      method: "DELETE",
      accessToken,
    }).then(() => { });
  },
};
