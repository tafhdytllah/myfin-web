"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getDashboardSummary,
  getRecentTransactions,
} from "@/features/dashboard/api/dashboard-api";
import { useAuthStore } from "@/stores/auth-store";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (accountId?: string) => ["dashboard", "summary", accountId ?? "all"] as const,
  recentTransactions: (accountId?: string) =>
    ["dashboard", "recent-transactions", accountId ?? "all"] as const,
};

export function useDashboardSummary(accountId?: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: dashboardKeys.summary(accountId),
    queryFn: () => getDashboardSummary(accessToken as string, accountId),
    enabled: Boolean(accessToken),
  });
}

export function useRecentTransactions(accountId?: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: dashboardKeys.recentTransactions(accountId),
    queryFn: () => getRecentTransactions(accessToken as string, accountId),
    enabled: Boolean(accessToken),
  });
}
