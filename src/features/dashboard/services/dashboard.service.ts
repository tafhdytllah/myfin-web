import { dashboardApi } from "@/features/dashboard/api/dashboard.api";

export const dashboardService = {
  getDashboardSummary(accessToken: string, accountId?: string) {
    return dashboardApi.getDashboardSummary(accessToken, accountId);
  },

  getRecentTransactions(accessToken: string, accountId?: string) {
    return dashboardApi.getRecentTransactions(accessToken, accountId);
  },
};
