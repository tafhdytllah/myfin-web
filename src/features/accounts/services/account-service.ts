import { accountApiRepository } from "@/features/accounts/repositories/account-api.repository";
import { AccountRepository } from "@/features/accounts/repositories/account-repository";
import {
  Account,
  AccountListFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account-types";

type ToggleAccountStatusParams = {
  accessToken: string;
  account: Account;
  active: boolean;
};

export class AccountService {
  constructor(private readonly repository: AccountRepository) {}

  getAccounts(accessToken: string, filters: AccountListFilters) {
    return this.repository.getAccounts(accessToken, filters);
  }

  createAccount(accessToken: string, payload: CreateAccountPayload) {
    return this.repository.createAccount(accessToken, payload);
  }

  updateAccount(
    accessToken: string,
    id: string,
    payload: UpdateAccountPayload,
  ) {
    return this.repository.updateAccount(accessToken, id, payload);
  }

  toggleAccountStatus({
    accessToken,
    account,
    active,
  }: ToggleAccountStatusParams) {
    return this.repository.updateAccount(accessToken, account.id, {
      name: account.name,
      active,
    });
  }
}

export const accountService = new AccountService(accountApiRepository);
