import { accountApi } from "@/features/accounts/api/account.api";
import {
  AccountListFilters,
  CreateAccountRequest,
  UpdateAccountRequest,
  UpdateStatusAccountRequest,
} from "@/features/accounts/types/account.types";

export const accountService = {

  createAccount(accessToken: string, payload: CreateAccountRequest) {
    return accountApi.createAccount(accessToken, payload);
  },

  updateAccount(accessToken: string, id: string, payload: UpdateAccountRequest) {
    return accountApi.updateAccount(accessToken, id, payload);
  },

  updateStatusAccount(accessToken: string, id: string, payload: UpdateStatusAccountRequest) {
    return accountApi.updateStatusAccount(accessToken, id, payload);
  },

  getAccounts(accessToken: string, filters: AccountListFilters) {
    return accountApi.getAccounts(accessToken, filters);
  },

  getAccount(accessToken: string, id: string) {
    return accountApi.getAccount(accessToken, id);
  },

  deleteAccount(accessToken: string, id: string) {
    return accountApi.deleteAccount(accessToken, id);
  },

};
