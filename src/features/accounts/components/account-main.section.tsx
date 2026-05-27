"use client";

import { ReactNode } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { SearchFilterInput } from "@/components/shared/inputs/search-filter-input";
import { ResetFiltersButton } from "@/components/shared/reset-filters-button";
import { SectionCard } from "@/components/shared/section-card";
import { useTranslations } from "@/lib/i18n/use-translations";

type AccountMainSectionProps = {
  action?: ReactNode;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  statusValue: string;
  statusDisplayValue?: string;
  onStatusChange: (value: string) => void;
};

export function AccountMainSection({
  action,
  hasActiveFilters,
  onResetFilters,
  keyword,
  onKeywordChange,
  statusValue,
  statusDisplayValue,
  onStatusChange,
}: AccountMainSectionProps) {
  const { t } = useTranslations();

  return (
    <SectionCard
      title={t("accounts.title")}
      description={t("accounts.description")}
      action={action}
    >
      <div className="max-w-2xl space-y-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_auto] sm:items-center">
          <div className="min-w-0">
            <SearchFilterInput
              value={keyword}
              onValueChange={onKeywordChange}
              placeholder={t("accounts.searchPlaceholder")}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-self-start">
            {hasActiveFilters ? (
              <ResetFiltersButton label={t("accounts.resetFilters")} onClick={onResetFilters} />
            ) : null}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FilterSelect
            value={statusValue}
            placeholder={t("accounts.statusFilter")}
            displayValue={statusDisplayValue}
            options={[
              { value: "all", label: t("accounts.statusAll") },
              { value: "active", label: t("common.active") },
              { value: "inactive", label: t("common.inactive") },
            ]}
            onValueChange={onStatusChange}
          />
        </div>
      </div>
    </SectionCard>
  );
}
