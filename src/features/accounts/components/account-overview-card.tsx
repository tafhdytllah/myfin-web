import { PencilLine, Power, PowerOff } from "lucide-react";

import { InfoMetricBlock } from "@/components/shared/info-metric-block";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";

type AccountItem = {
  id: string;
  name: string;
  currentBalance: number;
  openingBalance: number;
  usageCount: number;
  active: boolean;
};

type AccountOverviewCardProps = {
  item: AccountItem;
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

export function AccountOverviewCard({
  item,
  labels,
  formatCurrency,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: AccountOverviewCardProps) {
  return (
    <SectionCard
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
  );
}

export type { AccountItem };
