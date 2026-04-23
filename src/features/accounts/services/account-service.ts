import { accountApiRepository } from "@/features/accounts/repositories/account-api.repository";
import { ToggleAccountStatusParams } from "@/features/accounts/services/account-service.types";
import {
  AccountListFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account-types";

export const accountService = {
  getAccounts(accessToken: string, filters: AccountListFilters) {
    return accountApiRepository.getAccounts(accessToken, filters);
  },

  createAccount(accessToken: string, payload: CreateAccountPayload) {
    return accountApiRepository.createAccount(accessToken, payload);
  },

  updateAccount(
    accessToken: string,
    id: string,
    payload: UpdateAccountPayload,
  ) {
    return accountApiRepository.updateAccount(accessToken, id, payload);
  },

  toggleAccountStatus({
    accessToken,
    account,
    active,
  }: ToggleAccountStatusParams) {
    return accountApiRepository.updateAccount(accessToken, account.id, {
      name: account.name,
      active,
    });
  },
};
