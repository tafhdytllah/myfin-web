import { ContentCard } from "@/components/shared/content-card";
import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { ItemMeta } from "@/components/shared/item-meta";
import { SectionCard } from "@/components/shared/section-card";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { SectionLinkAction } from "@/components/shared/section-link-action";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";

type TopAccount = {
  id: string;
  name: string;
  usageCount: number;
  currentBalance: number;
};

type DashboardTopAccountsSectionProps = {
  title: string;
  description: string;
  seeAllLabel: string;
  seeAllHref: string;
  loading: boolean;
  isError: boolean;
  items: TopAccount[];
  emptyDescription: string;
  errorDescription: string;
  retryLabel: string;
  onRetry: () => void;
  activeLabel: string;
  usedTransactionsLabel: (count: number) => string;
  formatCurrency: (value: number) => string;
};

export function DashboardTopAccountsSection({
  title,
  description,
  seeAllLabel,
  seeAllHref,
  loading,
  isError,
  items,
  emptyDescription,
  errorDescription,
  retryLabel,
  onRetry,
  activeLabel,
  usedTransactionsLabel,
  formatCurrency,
}: DashboardTopAccountsSectionProps) {
  return (
    <SectionCard
      title={title}
      description={description}
      action={<SectionLinkAction href={seeAllHref} label={seeAllLabel} />}
    >
      {loading ? (
        <StackSkeleton
          count={3}
          className="space-y-4"
          itemClassName="h-24 rounded-3xl bg-muted"
        />
      ) : null}

      {isError ? (
        <InlineRetryState
          description={errorDescription}
          retryLabel={retryLabel}
          onRetry={onRetry}
        />
      ) : null}

      {!loading && !isError && items.length === 0 ? (
        <SectionEmptyState description={emptyDescription} dashed />
      ) : null}

      {!loading && !isError && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <ContentCard key={item.id} contentClassName="p-4">
              <div className="flex items-start justify-between gap-4">
                <ItemMeta
                  title={item.name}
                  subtitle={usedTransactionsLabel(item.usageCount)}
                />
                <StatusBadge tone="active">{activeLabel}</StatusBadge>
              </div>
              <p className="mt-4 text-2xl font-semibold text-[var(--color-foreground)]">
                {formatCurrency(item.currentBalance)}
              </p>
            </ContentCard>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}
