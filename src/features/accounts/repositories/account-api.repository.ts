import { apiRequest } from "@/lib/api/client";
import {
  Account,
  AccountListFilters,
  ApiEnvelope,
} from "@/features/accounts/types/account-types";
import { AccountRepository } from "@/features/accounts/repositories/account-repository";

function buildAccountQuery(filters: AccountListFilters) {
  const params = new URLSearchParams();

  if (filters.keyword) {
    params.set("keyword", filters.keyword);
  }

  if (filters.status === "active") {
    params.set("active", "true");
  }

  if (filters.status === "inactive") {
    params.set("active", "false");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

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
