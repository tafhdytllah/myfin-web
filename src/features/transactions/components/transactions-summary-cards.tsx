import { SummaryStatsGrid } from "@/components/shared/summary-stats-grid";

type TransactionsSummaryCardsProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function TransactionsSummaryCards({
  items,
}: TransactionsSummaryCardsProps) {
  return <SummaryStatsGrid items={items} className="md:grid-cols-3" />;
}
