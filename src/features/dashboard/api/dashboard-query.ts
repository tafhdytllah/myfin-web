export function buildRecentTransactionsQuery(accountId?: string) {
  const params = new URLSearchParams({
    page: "0",
    size: "5",
  });

  if (accountId) {
    params.set("accountId", accountId);
  }

  return `?${params.toString()}`;
}
