import { accountApi } from "@/features/accounts/api/account.api";
import {
  Account,
  AccountListFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account.types";

export const accountService = {
  getAccounts(accessToken: string, filters: AccountListFilters) {
    return accountApi.getAccounts(accessToken, filters);
  },

  createAccount(accessToken: string, payload: CreateAccountPayload) {
    return accountApi.createAccount(accessToken, payload);
  },

  updateAccount(
    accessToken: string,
    id: string,
    payload: UpdateAccountPayload,
  ) {
    return accountApi.updateAccount(accessToken, id, payload);
  },

  toggleAccountStatus({
    accessToken,
    account,
    active,
  }: {
    accessToken: string;
    account: Account;
    active: boolean;
  }) {
    return accountApi.updateAccount(accessToken, account.id, {
      name: account.name,
      active,
    });
  },
};
