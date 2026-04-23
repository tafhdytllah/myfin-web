import { transactionApiRepository } from "@/features/transactions/repositories/transaction-api.repository";
import {
  CreateTransactionPayload,
  TransactionFilters,
} from "@/features/transactions/types/transaction-types";

export const transactionService = {
  getTransactions(accessToken: string, filters: TransactionFilters) {
    return transactionApiRepository.getTransactions(accessToken, filters);
  },

  getTransaction(accessToken: string, id: string) {
    return transactionApiRepository.getTransaction(accessToken, id);
  },

  createTransaction(accessToken: string, payload: CreateTransactionPayload) {
    return transactionApiRepository.createTransaction(accessToken, payload);
  },

  deleteTransaction(accessToken: string, id: string) {
    return transactionApiRepository.deleteTransaction(accessToken, id);
  },

  getTransactionSummary(accessToken: string, accountId: string) {
    return transactionApiRepository.getTransactionSummary(accessToken, accountId);
  },
};
