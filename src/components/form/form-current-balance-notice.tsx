"use client";

import { InfoMetricBlock } from "@/components/info-metric-block";
import { InfoNotice } from "@/components/info-notice";
import { formatCurrency } from "@/lib/formatters/currency";
import { useTranslations } from "@/lib/i18n/use-translations";

type FormCurrentBalanceNoticeProps = {
  label: string;
  balance: number;
};

export function FormCurrentBalanceNotice({
  label,
  balance,
}: FormCurrentBalanceNoticeProps) {
  const { t } = useTranslations();

  return (
    <InfoNotice className="text-foreground">
      <InfoMetricBlock
        eyebrow={t(label)}
        value={formatCurrency(balance)}
        className="space-y-2"
        eyebrowClassName="text-muted-foreground"
        valueClassName="text-lg font-semibold text-foreground"
      />
    </InfoNotice>
  );
}
