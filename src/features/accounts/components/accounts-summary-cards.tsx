import { SummaryStatsGrid } from "@/components/shared/summary-stats-grid";

type AccountsSummaryCardsProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function AccountsSummaryCards({ items }: AccountsSummaryCardsProps) {
  return <SummaryStatsGrid items={items} className="md:grid-cols-3" />;
}
