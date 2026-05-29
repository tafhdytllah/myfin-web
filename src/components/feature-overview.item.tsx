import { ReactNode } from "react";

import { InfoMetricBlock } from "@/components/info-metric-block";
import { SectionCard } from "@/components/section-card";

type FeatureOverviewItemProps = {
  title: string;
  action?: ReactNode;
  eyebrow: string;
  value: ReactNode;
  description?: ReactNode;
};

export function FeatureOverviewItem({
  title,
  action,
  eyebrow,
  value,
  description,
}: FeatureOverviewItemProps) {
  return (
    <SectionCard title={title} action={action}>
      <InfoMetricBlock
        eyebrow={eyebrow}
        value={value}
        description={description}
      />
    </SectionCard>
  );
}
