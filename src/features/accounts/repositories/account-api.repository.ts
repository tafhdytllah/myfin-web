import { apiRequest } from "@/lib/api/client";
import {
  Account,
  ApiEnvelope,
} from "@/features/accounts/types/account-types";
import { buildAccountQuery } from "@/features/accounts/repositories/account-api.query";
import { AccountRepository } from "@/features/accounts/repositories/account-repository";

export const accountApiRepository: AccountRepository = {
  async getAccounts(accessToken, filters) {
    const response = await apiRequest<ApiEnvelope<Account[]>>(
      `/api/v1/accounts${buildAccountQuery(filters)}`,
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },

  async createAccount(accessToken, payload) {
    const response = await apiRequest<ApiEnvelope<Account>>("/api/v1/accounts", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateAccount(accessToken, id, payload) {
    const response = await apiRequest<ApiEnvelope<Account>>(`/api/v1/accounts/${id}`, {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },
};
