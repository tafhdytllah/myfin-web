import { buildAccountQuery } from "@/features/accounts/api/account-query";
import {
  Account,
  AccountListFilters,
  ApiEnvelope,
  CreateAccountPayload,
  UpdateAccountPayload,
  UpdateStatusAccountPayload,
} from "@/features/accounts/types/account.types";
import { apiRequest } from "@/lib/api/client";

export const accountApi = {

  async createAccount(accessToken: string, payload: CreateAccountPayload): Promise<Account> {
    const response = await apiRequest<ApiEnvelope<Account>>("/api/v1/accounts", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateAccount(accessToken: string, id: string, payload: UpdateAccountPayload): Promise<Account> {
    const response = await apiRequest<ApiEnvelope<Account>>(`/api/v1/accounts/${id}`, {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateStatusAccount(accessToken: string, id: string, payload: UpdateStatusAccountPayload): Promise<Account> {
    const response = await apiRequest<ApiEnvelope<Account>>(`/api/v1/accounts/${id}/status`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async getAccounts(accessToken: string, filters: AccountListFilters): Promise<Account[]> {
    const response = await apiRequest<ApiEnvelope<Account[]>>(`/api/v1/accounts${buildAccountQuery(filters)}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async getAccount(accessToken: string, id: string): Promise<Account> {
    const response = await apiRequest<ApiEnvelope<Account>>(`/api/v1/accounts/${id}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  deleteAccount(accessToken: string, id: string): Promise<void> {
    return apiRequest<ApiEnvelope<null>>(`/api/v1/accounts/${id}`, {
      method: "DELETE",
      accessToken,
    }).then(() => { });
  },

};
