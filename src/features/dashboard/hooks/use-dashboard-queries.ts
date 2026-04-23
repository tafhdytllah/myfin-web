"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "@/features/dashboard/hooks/dashboard-query-keys";
import { dashboardService } from "@/features/dashboard/services/dashboard-service";
import { useAuthStore } from "@/stores/auth-store";

export function useDashboardSummary(accountId?: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: dashboardKeys.summary(accountId),
    queryFn: () =>
      dashboardService.getDashboardSummary(accessToken as string, accountId),
    enabled: Boolean(accessToken),
  });
}

export function useRecentTransactions(accountId?: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: dashboardKeys.recentTransactions(accountId),
    queryFn: () =>
      dashboardService.getRecentTransactions(accessToken as string, accountId),
    enabled: Boolean(accessToken),
  });
}
