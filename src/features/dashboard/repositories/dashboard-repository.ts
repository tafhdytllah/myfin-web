import {
  DashboardSummary,
  DashboardTransaction,
} from "@/features/dashboard/types/dashboard-types";

export interface DashboardRepository {
  getDashboardSummary(
    accessToken: string,
    accountId?: string,
  ): Promise<DashboardSummary>;
  getRecentTransactions(
    accessToken: string,
    accountId?: string,
  ): Promise<DashboardTransaction[]>;
}
