import { FilterCardShell } from "@/components/shared/filter-card-shell";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchFilterInput } from "@/components/shared/search-filter-input";

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
    <FilterCardShell
      title={title}
      description={description}
      hasActiveFilters={hasActiveFilters}
      resetLabel={resetLabel}
      onReset={onReset}
      className="grid gap-3 md:grid-cols-2"
    >
      <SearchFilterInput
        value={keyword}
        onValueChange={onKeywordChange}
        placeholder={searchPlaceholder}
      />
      <FilterSelect
        value={statusValue}
        placeholder={statusPlaceholder}
        displayValue={statusDisplayValue}
        options={statusOptions}
        onValueChange={onStatusChange}
      />
    </FilterCardShell>
  );
}
