import { apiRequest } from "@/lib/api/client";
import { buildTransactionQuery } from "@/features/transactions/repositories/transaction-api.query";
import { TransactionRepository } from "@/features/transactions/repositories/transaction-repository";
import {
  ApiEnvelope,
  Transaction,
  TransactionListEnvelope,
  TransactionSummary,
} from "@/features/transactions/types/transaction-types";

export const transactionApiRepository: TransactionRepository = {
  async getTransactions(accessToken, filters) {
    return apiRequest<ApiEnvelope<Transaction[]>>(
      `/api/v1/transactions?${buildTransactionQuery(filters)}`,
      {
        method: "GET",
        accessToken,
      },
    ) as Promise<TransactionListEnvelope>;
  },

  async getTransaction(accessToken, id) {
    const response = await apiRequest<ApiEnvelope<Transaction>>(
      `/api/v1/transactions/${id}`,
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },

  async createTransaction(accessToken, payload) {
    const response = await apiRequest<ApiEnvelope<Transaction>>("/api/v1/transactions", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async deleteTransaction(accessToken, id) {
    await apiRequest<ApiEnvelope<null>>(`/api/v1/transactions/${id}`, {
      method: "DELETE",
      accessToken,
    });
  },

  async getTransactionSummary(accessToken, accountId) {
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
