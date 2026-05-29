import { PencilLine, Power, PowerOff } from "lucide-react";

import { FeatureOverviewItem } from "@/components/feature-overview.item";
import { RowActionsMenu } from "@/components/row-actions-menu";
import { StatusBadge } from "@/components/status-badge";
import { useTranslations } from "@/lib/i18n/use-translations";

type AccountItem = {
  id: string;
  name: string;
  currentBalance: number;
  openingBalance: number;
  usageCount: number;
  active: boolean;
};

type AccountGridItemProps = {
  item: AccountItem;
  formatCurrency: (value: number) => string;
  activatingPending: boolean;
  onEdit: (item: AccountItem) => void;
  onDeactivate: (item: AccountItem) => void;
  onActivate: (item: AccountItem) => void;
};

export function AccountGridItem({
  item,
  formatCurrency,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: AccountGridItemProps) {
  const { t } = useTranslations();

  return (
    <FeatureOverviewItem
      title={item.name}
      action={
        <div className="flex items-center gap-2">
          <StatusBadge tone={item.active ? "active" : "inactive"}>
            {item.active ? t("common.active") : t("common.inactive")}
          </StatusBadge>
          <RowActionsMenu
            srLabel={t("common.actions")}
            triggerSize="icon"
            triggerClassName="rounded-full"
            items={[
              {
                label: t("common.edit"),
                icon: <PencilLine className="size-4" />,
                onSelect: () => onEdit(item),
              },
              item.active
                ? {
                  label: t("common.deactivate"),
                  icon: <PowerOff className="size-4" />,
                  onSelect: () => onDeactivate(item),
                }
                : {
                  label: t("common.activate"),
                  icon: <Power className="size-4" />,
                  disabled: activatingPending,
                  onSelect: () => onActivate(item),
                },
            ]}
          />
        </div>
      }
      eyebrow={t("accounts.currentBalance")}
      value={formatCurrency(item.currentBalance)}
      description={
        <>
          <p>{t("accounts.usedTransactions", { count: item.usageCount })}</p>
          <p className="mt-3">{t("accounts.openingBalanceValue", { amount: item.openingBalance })}</p>
        </>
      }
    />
  );
}

export type { AccountItem };
