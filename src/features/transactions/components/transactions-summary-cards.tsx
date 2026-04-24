import { SummaryStatCard } from "@/components/shared/summary-stat-card";

type TransactionsSummaryCardsProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function TransactionsSummaryCards({
  items,
}: TransactionsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <SummaryStatCard key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
