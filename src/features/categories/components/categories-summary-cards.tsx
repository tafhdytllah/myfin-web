import { SummaryStatCard } from "@/components/shared/summary-stat-card";

type CategoriesSummaryCardsProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function CategoriesSummaryCards({ items }: CategoriesSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {items.map((item) => (
        <SummaryStatCard key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
