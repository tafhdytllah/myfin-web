import { SummaryStatCard } from "@/components/shared/summary-stat-card";

type AccountsSummaryCardsProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function AccountsSummaryCards({ items }: AccountsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <SummaryStatCard key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
