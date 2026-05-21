import { buildRecentTransactionsQuery } from "@/features/dashboard/api/dashboard-query";
import {
  ApiEnvelope,
  DashboardSummary,
  DashboardTransaction,
} from "@/features/dashboard/types/dashboard.types";
import { apiRequest } from "@/lib/api/client";

export const dashboardApi = {
  async getDashboardSummary(
    accessToken: string,
    accountId?: string,
  ): Promise<DashboardSummary> {
    const path = accountId
      ? `/api/v1/dashboard/${accountId}`
      : "/api/v1/dashboard";

    const response = await apiRequest<ApiEnvelope<DashboardSummary>>(path, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async getRecentTransactions(
    accessToken: string,
    accountId?: string,
  ): Promise<DashboardTransaction[]> {
    const response = await apiRequest<ApiEnvelope<DashboardTransaction[]>>(
      `/api/v1/transactions${buildRecentTransactionsQuery(accountId)}`,
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },
};
