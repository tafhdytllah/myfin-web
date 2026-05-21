"use client";

import { InfoMetricBlock } from "@/components/shared/info-metric-block";
import { InfoNotice } from "@/components/shared/info-notice";
import { formatCurrency } from "@/lib/formatters/currency";
import { useTranslations } from "@/lib/i18n/use-translations";

type AccountCurrentBalanceNoticeProps = {
  balance: number;
};

export function AccountCurrentBalanceNotice({
  balance,
}: AccountCurrentBalanceNoticeProps) {
  const { t } = useTranslations();

  return (
    <InfoNotice className="text-foreground">
      <InfoMetricBlock
        eyebrow={t("accounts.currentBalance")}
        value={formatCurrency(balance)}
        className="space-y-2"
        eyebrowClassName="text-muted-foreground"
        valueClassName="text-lg font-semibold text-foreground"
      />
    </InfoNotice>
  );
}
