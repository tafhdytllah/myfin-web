export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (accountId?: string) =>
    ["dashboard", "summary", accountId ?? "all"] as const,
  recentTransactions: (accountId?: string) =>
    ["dashboard", "recent-transactions", accountId ?? "all"] as const,
};
