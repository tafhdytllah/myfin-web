import { buildAccountQuery } from "@/features/accounts/api/account-query";
import {
  Account,
  AccountListFilters,
  CreateAccountRequest,
  UpdateAccountRequest,
  UpdateStatusAccountRequest,
} from "@/features/accounts/types/account.types";
import { apiRequest } from "@/lib/api/client";
import { ApiResponse } from "@/types/api.types";

export const accountApi = {

  async createAccount(accessToken: string, payload: CreateAccountRequest): Promise<Account> {
    const response = await apiRequest<ApiResponse<Account>>("/api/v1/accounts", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateAccount(accessToken: string, id: string, payload: UpdateAccountRequest): Promise<Account> {
    const response = await apiRequest<ApiResponse<Account>>(`/api/v1/accounts/${id}`, {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateStatusAccount(accessToken: string, id: string, payload: UpdateStatusAccountRequest): Promise<Account> {
    const response = await apiRequest<ApiResponse<Account>>(`/api/v1/accounts/${id}/status`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async getAccounts(accessToken: string, filters: AccountListFilters): Promise<Account[]> {
    const response = await apiRequest<ApiResponse<Account[]>>(`/api/v1/accounts?${buildAccountQuery(filters)}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async getAccount(accessToken: string, id: string): Promise<Account> {
    const response = await apiRequest<ApiResponse<Account>>(`/api/v1/accounts/${id}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  deleteAccount(accessToken: string, id: string): Promise<void> {
    return apiRequest<ApiResponse<null>>(`/api/v1/accounts/${id}`, {
      method: "DELETE",
      accessToken,
    }).then(() => { });
  },

};
