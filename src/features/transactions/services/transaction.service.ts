import { transactionApi } from "@/features/transactions/api/transaction.api";
import {
  CreateTransactionRequest,
  TransactionListFilters,
  UpdateTransactionRequest,
} from "@/features/transactions/types/transaction.types";

export const transactionService = {

  createTransaction(accessToken: string, payload: CreateTransactionRequest) {
    return transactionApi.createTransaction(accessToken, payload);
  },

  updateTransaction(accessToken: string, id: string, payload: UpdateTransactionRequest) {
    return transactionApi.updateTransaction(accessToken, id, payload);
  },

  async getTransactions(accessToken: string, filters: TransactionListFilters) {
    const response = await transactionApi.getTransactions(accessToken, filters);

    return {
      items: response.data,
      meta: response.meta,
    }
  },

  getTransaction(accessToken: string, id: string) {
    return transactionApi.getTransaction(accessToken, id);
  },

  getTransactionSummary(accessToken: string, accountId: string) {
    return transactionApi.getTransactionSummary(accessToken, accountId);
  },

  deleteTransaction(accessToken: string, id: string) {
    return transactionApi.deleteTransaction(accessToken, id);
  },

};
