import { buildAccountQuery } from "@/features/accounts/api/account-query";
import {
  Account,
  AccountListFilters,
  ApiEnvelope,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account.types";
import { apiRequest } from "@/lib/api/client";

export const accountApi = {
  async getAccounts(
    accessToken: string,
    filters: AccountListFilters,
  ): Promise<Account[]> {
    const response = await apiRequest<ApiEnvelope<Account[]>>(
      `/api/v1/accounts${buildAccountQuery(filters)}`,
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },

  async createAccount(
    accessToken: string,
    payload: CreateAccountPayload,
  ): Promise<Account> {
    const response = await apiRequest<ApiEnvelope<Account>>("/api/v1/accounts", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateAccount(
    accessToken: string,
    id: string,
    payload: UpdateAccountPayload,
  ): Promise<Account> {
    const response = await apiRequest<ApiEnvelope<Account>>(
      `/api/v1/accounts/${id}`,
      {
        method: "PUT",
        accessToken,
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },
};
