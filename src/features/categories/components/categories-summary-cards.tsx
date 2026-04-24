import { SummaryStatsGrid } from "@/components/shared/summary-stats-grid";

type CategoriesSummaryCardsProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function CategoriesSummaryCards({ items }: CategoriesSummaryCardsProps) {
  return <SummaryStatsGrid items={items} className="md:grid-cols-5" />;
}
