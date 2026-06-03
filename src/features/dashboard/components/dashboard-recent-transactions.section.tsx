import { ContentCard } from "@/components/content-card";
import { InlineRetryState } from "@/components/inline-retry-state";
import { ItemMeta } from "@/components/item-meta";
import { SectionCard } from "@/components/section-card";
import { SectionEmptyState } from "@/components/section-empty-state";
import { SectionLinkAction } from "@/components/section-link-action";
import { StackSkeleton } from "@/components/stack-skeleton";
import { StatusBadge } from "@/components/status-badge";
import { CATEGORY_TYPES, CategoryType } from "@/features/categories/types/category.types";

type RecentTransaction = {
  id: string;
  type: CategoryType;
  categoryName: string;
  accountName: string;
  createdAt: string;
  amount: number;
};

type DashboardRecentTransactionsSectionProps = {
  title: string;
  description: string;
  viewAllLabel: string;
  viewAllHref: string;
  loading: boolean;
  isError: boolean;
  items: RecentTransaction[];
  emptyDescription: string;
  errorDescription: string;
  retryLabel: string;
  onRetry: () => void;
  formatDate: (value: string) => string;
  formatCurrency: (value: number) => string;
  incomeLabel: string;
  expenseLabel: string;
};

export function DashboardRecentTransactionsSection({
  title,
  description,
  viewAllLabel,
  viewAllHref,
  loading,
  isError,
  items,
  emptyDescription,
  errorDescription,
  retryLabel,
  onRetry,
  formatDate,
  formatCurrency,
  incomeLabel,
  expenseLabel,
}: DashboardRecentTransactionsSectionProps) {
  return (
    <SectionCard
      title={title}
      description={description}
      action={<SectionLinkAction href={viewAllHref} label={viewAllLabel} />}
    >
      {loading ? (
        <StackSkeleton
          count={3}
          className="space-y-4"
          itemClassName="h-20 rounded-3xl bg-muted"
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
            <ContentCard
              key={item.id}
              className="text-left transition hover:bg-muted/60"
              contentClassName="flex items-center justify-between gap-4 p-4"
            >
              <ItemMeta
                title={item.categoryName}
                subtitle={
                  <>
                    {item.accountName} {" - "} {formatDate(item.createdAt)}
                  </>
                }
                subtitleClassName="truncate"
              />
              <div className="shrink-0 text-right">
                <StatusBadge tone={item.type === CATEGORY_TYPES.INCOME ? "income" : "expense"}>
                  {item.type === CATEGORY_TYPES.INCOME ? incomeLabel : expenseLabel}
                </StatusBadge>
                <p className="mt-2 font-semibold text-(--color-foreground)">
                  {formatCurrency(item.amount)}
                </p>
              </div>
            </ContentCard>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}
