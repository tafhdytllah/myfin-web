import { SummaryStatCard } from "@/components/shared/summary-stat-card";
import { cn } from "@/lib/utils";

type SummaryStatsGridProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
  className?: string;
};

export function SummaryStatsGrid({
  items,
  className,
}: SummaryStatsGridProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item) => (
        <SummaryStatCard key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
