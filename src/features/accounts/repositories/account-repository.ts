import {
  Account,
  AccountListFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account-types";

export interface AccountRepository {
  getAccounts(accessToken: string, filters: AccountListFilters): Promise<Account[]>;
  createAccount(
    accessToken: string,
    payload: CreateAccountPayload,
  ): Promise<Account>;
  updateAccount(
    accessToken: string,
    id: string,
    payload: UpdateAccountPayload,
  ): Promise<Account>;
}
