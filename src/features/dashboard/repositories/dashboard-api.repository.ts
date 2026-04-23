import { apiRequest } from "@/lib/api/client";
import {
  ApiEnvelope,
  DashboardSummary,
  DashboardTransaction,
} from "@/features/dashboard/types/dashboard-types";
import { buildRecentTransactionsQuery } from "@/features/dashboard/repositories/dashboard-api.query";
import { DashboardRepository } from "@/features/dashboard/repositories/dashboard-repository";

export const dashboardApiRepository: DashboardRepository = {
  async getDashboardSummary(accessToken, accountId) {
    const path = accountId
      ? `/api/v1/dashboard/${accountId}`
      : "/api/v1/dashboard";

    const response = await apiRequest<ApiEnvelope<DashboardSummary>>(path, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async getRecentTransactions(accessToken, accountId) {
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
