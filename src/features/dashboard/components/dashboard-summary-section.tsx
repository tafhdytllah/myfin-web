import { SectionCard } from "@/components/shared/section-card";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCardSkeletonGrid } from "@/components/shared/section-card-skeleton-grid";
import { StatusBadge } from "@/components/shared/status-badge";

type SummaryCard = {
  key: string;
  label: string;
  tone: "income" | "expense" | "active";
  value: string;
};

type DashboardSummarySectionProps = {
  loading: boolean;
  isError: boolean;
  cards: SummaryCard[];
  summaryDescription: string;
  retryTitle: string;
  retryDescription: string;
  retryLabel: string;
  onRetry: () => void;
};

export function DashboardSummarySection({
  loading,
  isError,
  cards,
  summaryDescription,
  retryTitle,
  retryDescription,
  retryLabel,
  onRetry,
}: DashboardSummarySectionProps) {
  if (loading) {
    return (
      <SectionCardSkeletonGrid
        count={3}
        gridClassName="xl:grid-cols-3"
        skeletonCount={2}
        skeletonItemClassName="rounded bg-muted"
        skeletonClassName="space-y-3 [&>*:nth-child(1)]:h-4 [&>*:nth-child(1)]:w-24 [&>*:nth-child(2)]:h-10 [&>*:nth-child(2)]:w-40"
      />
    );
  }

  if (isError) {
    return (
      <RetryCard
        title={retryTitle}
        description={retryDescription}
        retryLabel={retryLabel}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => (
        <SectionCard
          key={card.key}
          title={card.label}
          description={summaryDescription}
        >
          <div className="flex items-end justify-between gap-4">
            <p className="text-3xl font-semibold text-[var(--color-foreground)]">
              {card.value}
            </p>
            <StatusBadge tone={card.tone}>{card.label}</StatusBadge>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
