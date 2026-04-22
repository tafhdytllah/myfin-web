import { apiRequest } from "@/lib/api/client";
import {
  Account,
  AccountListFilters,
  ApiEnvelope,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/features/accounts/types/account-types";

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

export async function getAccounts(
  accessToken: string,
  filters: AccountListFilters,
) {
  const response = await apiRequest<ApiEnvelope<Account[]>>(
    `/api/v1/accounts${buildAccountQuery(filters)}`,
    {
      method: "GET",
      accessToken,
    },
  );

  return response.data;
}

export async function createAccount(
  accessToken: string,
  payload: CreateAccountPayload,
) {
  const response = await apiRequest<ApiEnvelope<Account>>("/api/v1/accounts", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateAccount(
  accessToken: string,
  id: string,
  payload: UpdateAccountPayload,
) {
  const response = await apiRequest<ApiEnvelope<Account>>(`/api/v1/accounts/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(payload),
  });

  return response.data;
}
