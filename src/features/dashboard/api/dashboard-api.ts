import { apiRequest } from "@/lib/api/client";
import {
  ApiEnvelope,
  DashboardSummary,
  DashboardTransaction,
} from "@/features/dashboard/types/dashboard-types";

export async function getDashboardSummary(
  accessToken: string,
  accountId?: string,
) {
  const path = accountId
    ? `/api/v1/dashboard/${accountId}`
    : "/api/v1/dashboard";

  const response = await apiRequest<ApiEnvelope<DashboardSummary>>(path, {
    method: "GET",
    accessToken,
  });

  return response.data;
}

export async function getRecentTransactions(
  accessToken: string,
  accountId?: string,
) {
  const params = new URLSearchParams({
    page: "0",
    size: "5",
  });

  if (accountId) {
    params.set("accountId", accountId);
  }

  const response = await apiRequest<ApiEnvelope<DashboardTransaction[]>>(
    `/api/v1/transactions?${params.toString()}`,
    {
      method: "GET",
      accessToken,
    },
  );

  return response.data;
}
