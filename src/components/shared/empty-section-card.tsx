import { SectionCard } from "@/components/shared/section-card";
import { SectionEmptyState } from "@/components/shared/section-empty-state";

type EmptySectionCardProps = {
  title: string;
  description: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  }[];
};

export function EmptySectionCard({
  title,
  description,
  actions,
}: EmptySectionCardProps) {
  return (
    <SectionCard title={title} description={description}>
      <SectionEmptyState description={description} actions={actions} />
    </SectionCard>
  );
}
