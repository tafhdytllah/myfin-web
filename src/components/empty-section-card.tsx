import { SectionCard } from "@/components/section-card";
import { SectionEmptyState } from "@/components/section-empty-state";

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
      {actions && <SectionEmptyState description={description} actions={actions} />}
    </SectionCard>
  );
}
