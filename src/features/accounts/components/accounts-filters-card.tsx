import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/shared/filter-select";
import { ResetFiltersButton } from "@/components/shared/reset-filters-button";
import { SectionCard } from "@/components/shared/section-card";

type AccountsFiltersCardProps = {
  title: string;
  description: string;
  hasActiveFilters: boolean;
  resetLabel: string;
  onReset: () => void;
  keyword: string;
  searchPlaceholder: string;
  onKeywordChange: (value: string) => void;
  statusValue: string;
  statusPlaceholder: string;
  statusDisplayValue?: string;
  statusOptions: Array<{ value: string; label: string }>;
  onStatusChange: (value: string) => void;
};

export function AccountsFiltersCard({
  title,
  description,
  hasActiveFilters,
  resetLabel,
  onReset,
  keyword,
  searchPlaceholder,
  onKeywordChange,
  statusValue,
  statusPlaceholder,
  statusDisplayValue,
  statusOptions,
  onStatusChange,
}: AccountsFiltersCardProps) {
  return (
    <SectionCard
      title={title}
      description={description}
      action={
        hasActiveFilters ? (
          <ResetFiltersButton label={resetLabel} onClick={onReset} />
        ) : null
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder={searchPlaceholder}
        />
        <FilterSelect
          value={statusValue}
          placeholder={statusPlaceholder}
          displayValue={statusDisplayValue}
          options={statusOptions}
          onValueChange={onStatusChange}
        />
      </div>
    </SectionCard>
  );
}
