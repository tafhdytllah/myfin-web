import {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  TransactionListEnvelope,
  TransactionSummary,
} from "@/features/transactions/types/transaction-types";

export interface TransactionRepository {
  getTransactions(
    accessToken: string,
    filters: TransactionFilters,
  ): Promise<TransactionListEnvelope>;
  getTransaction(accessToken: string, id: string): Promise<Transaction>;
  createTransaction(
    accessToken: string,
    payload: CreateTransactionPayload,
  ): Promise<Transaction>;
  deleteTransaction(accessToken: string, id: string): Promise<void>;
  getTransactionSummary(
    accessToken: string,
    accountId: string,
  ): Promise<TransactionSummary>;
}
