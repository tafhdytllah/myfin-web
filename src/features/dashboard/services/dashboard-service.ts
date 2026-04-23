import { dashboardApiRepository } from "@/features/dashboard/repositories/dashboard-api.repository";

export const dashboardService = {
  getDashboardSummary(accessToken: string, accountId?: string) {
    return dashboardApiRepository.getDashboardSummary(accessToken, accountId);
  },

  getRecentTransactions(accessToken: string, accountId?: string) {
    return dashboardApiRepository.getRecentTransactions(accessToken, accountId);
  },
};
