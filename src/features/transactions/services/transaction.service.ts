import { transactionApi } from "@/features/transactions/api/transaction.api";
import {
  CreateTransactionPayload,
  TransactionFilters,
} from "@/features/transactions/types/transaction.types";

export const transactionService = {
  getTransactions(accessToken: string, filters: TransactionFilters) {
    return transactionApi.getTransactions(accessToken, filters);
  },

  getTransaction(accessToken: string, id: string) {
    return transactionApi.getTransaction(accessToken, id);
  },

  createTransaction(accessToken: string, payload: CreateTransactionPayload) {
    return transactionApi.createTransaction(accessToken, payload);
  },

  deleteTransaction(accessToken: string, id: string) {
    return transactionApi.deleteTransaction(accessToken, id);
  },

  getTransactionSummary(accessToken: string, accountId: string) {
    return transactionApi.getTransactionSummary(accessToken, accountId);
  },
};
