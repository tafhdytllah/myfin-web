import { PencilLine, Power, PowerOff } from "lucide-react";

import { EmptySectionCard } from "@/components/shared/empty-section-card";
import { InfoMetricBlock } from "@/components/shared/info-metric-block";
import { RetryCard } from "@/components/shared/retry-card";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";

type AccountItem = {
  id: string;
  name: string;
  currentBalance: number;
  openingBalance: number;
  usageCount: number;
  active: boolean;
};

type AccountsGridSectionProps = {
  loading: boolean;
  isError: boolean;
  items: AccountItem[];
  hasActiveFilters: boolean;
  retryTitle: string;
  retryDescription: string;
  retryLabel: string;
  onRetry: () => void;
  emptyTitle: string;
  emptyDescription: string;
  addLabel: string;
  resetFiltersLabel: string;
  onAdd: () => void;
  onResetFilters: () => void;
  labels: {
    active: string;
    inactive: string;
    edit: string;
    activate: string;
    deactivate: string;
    actions: string;
    currentBalance: string;
    usedTransactions: (count: number) => string;
    openingBalance: (amount: string) => string;
  };
  formatCurrency: (value: number) => string;
  activatingPending: boolean;
  onEdit: (item: AccountItem) => void;
  onDeactivate: (item: AccountItem) => void;
  onActivate: (item: AccountItem) => void;
};

export function AccountsGridSection({
  loading,
  isError,
  items,
  hasActiveFilters,
  retryTitle,
  retryDescription,
  retryLabel,
  onRetry,
  emptyTitle,
  emptyDescription,
  addLabel,
  resetFiltersLabel,
  onAdd,
  onResetFilters,
  labels,
  formatCurrency,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: AccountsGridSectionProps) {
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SectionCard key={index} title=" ">
            <StackSkeleton
              count={3}
              itemClassName="h-4 rounded bg-muted"
              className="space-y-3 [&>*:nth-child(2)]:h-10 [&>*:nth-child(2)]:w-40 [&>*:nth-child(1)]:w-24 [&>*:nth-child(3)]:w-32"
            />
          </SectionCard>
        ))}
      </div>
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

  if (items.length === 0) {
    return (
      <EmptySectionCard
        title={emptyTitle}
        description={emptyDescription}
        actions={[
          {
            label: addLabel,
            onClick: onAdd,
          },
          ...(hasActiveFilters
            ? [
                {
                  label: resetFiltersLabel,
                  onClick: onResetFilters,
                  variant: "outline" as const,
                },
              ]
            : []),
        ]}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <SectionCard
          key={item.id}
          title={item.name}
          action={
            <div className="flex items-center gap-2">
              <StatusBadge tone={item.active ? "active" : "inactive"}>
                {item.active ? labels.active : labels.inactive}
              </StatusBadge>
              <RowActionsMenu
                srLabel={labels.actions}
                triggerSize="icon"
                triggerClassName="rounded-full"
                items={[
                  {
                    label: labels.edit,
                    icon: <PencilLine className="size-4" />,
                    onSelect: () => onEdit(item),
                  },
                  item.active
                    ? {
                        label: labels.deactivate,
                        icon: <PowerOff className="size-4" />,
                        onSelect: () => onDeactivate(item),
                      }
                    : {
                        label: labels.activate,
                        icon: <Power className="size-4" />,
                        disabled: activatingPending,
                        onSelect: () => onActivate(item),
                      },
                ]}
              />
            </div>
          }
        >
          <InfoMetricBlock
            eyebrow={labels.currentBalance}
            value={formatCurrency(item.currentBalance)}
            description={
              <>
                <p>{labels.usedTransactions(item.usageCount)}</p>
                <p className="mt-3">
                  {labels.openingBalance(formatCurrency(item.openingBalance))}
                </p>
              </>
            }
          />
        </SectionCard>
      ))}
    </div>
  );
}
