export function formatCurrency(
  amount: number | string | null | undefined,
  locale = "id-ID",
  currency = "IDR",
) {
  const normalizedAmount =
    typeof amount === "number"
      ? amount
      : typeof amount === "string"
        ? Number(amount)
        : 0;

  const safeAmount = Number.isFinite(normalizedAmount) ? normalizedAmount : 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(safeAmount);
}
