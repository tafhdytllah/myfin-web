import { transactionApi } from "@/features/transactions/api/transaction.api";
import {
  CreateTransactionRequest,
  TransactionListFilters,
} from "@/features/transactions/types/transaction.types";

export const transactionService = {

  createTransaction(accessToken: string, payload: CreateTransactionRequest) {
    return transactionApi.createTransaction(accessToken, payload);
  },

  getTransactions(accessToken: string, filters: TransactionListFilters) {
    return transactionApi.getTransactions(accessToken, filters);
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
