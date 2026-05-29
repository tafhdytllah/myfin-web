import { EmptySectionCard } from "@/components/empty-section-card";
import { RetryCard } from "@/components/retry-card";
import { SectionCardSkeletonGrid } from "@/components/section-card-skeleton-grid";
import {
  AccountGridItem,
  AccountItem,
} from "@/features/accounts/components/account-grid.item";
import { useTranslations } from "@/lib/i18n/use-translations";

type AccountGridSectionProps = {
  loading: boolean;
  isError: boolean;
  items: AccountItem[];
  onRetry: () => void;
  formatCurrency: (value: number) => string;
  activatingPending: boolean;
  onEdit: (item: AccountItem) => void;
  onDeactivate: (item: AccountItem) => void;
  onActivate: (item: AccountItem) => void;
};

export function AccountGridSection({
  loading,
  isError,
  items,
  onRetry,
  formatCurrency,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: AccountGridSectionProps) {
  const { t } = useTranslations();

  if (loading) {
    return (
      <SectionCardSkeletonGrid
        count={3}
        gridClassName="lg:grid-cols-2 xl:grid-cols-3"
        skeletonCount={3}
        skeletonItemClassName="h-4 rounded bg-muted"
        skeletonClassName="space-y-3 [&>*:nth-child(2)]:h-10 [&>*:nth-child(2)]:w-40 [&>*:nth-child(1)]:w-24 [&>*:nth-child(3)]:w-32"
      />
    );
  }

  if (isError) {
    return (
      <RetryCard
        title={t("accounts.loadErrorTitle")}
        description={t("accounts.loadErrorDescription")}
        retryLabel={t("accounts.retry")}
        onRetry={onRetry}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptySectionCard
        title={t("accounts.emptyTitle")}
        description={t("accounts.emptyDescription")}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <AccountGridItem
          key={item.id}
          item={item}
          formatCurrency={formatCurrency}
          activatingPending={activatingPending}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
          onActivate={onActivate}
        />
      ))}
    </div>
  );
}
