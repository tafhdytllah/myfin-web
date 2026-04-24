import { SectionCard } from "@/components/shared/section-card";

type SummaryStatCardProps = {
  label: string;
  value: string;
};

export function SummaryStatCard({ label, value }: SummaryStatCardProps) {
  return (
    <SectionCard title={label}>
      <p className="text-2xl font-semibold text-(--color-foreground)">
        {value}
      </p>
    </SectionCard>
  );
}
