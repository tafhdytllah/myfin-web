import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/shared/section-card";
import { FilterSelect } from "@/components/shared/filter-select";
import { ResetFiltersButton } from "@/components/shared/reset-filters-button";

type Option = {
  value: string;
  label: string;
};

type TransactionsFiltersCardProps = {
  title: string;
  description: string;
  hasActiveFilters: boolean;
  resetLabel: string;
  onReset: () => void;
  keyword: string;
  searchPlaceholder: string;
  onKeywordChange: (value: string) => void;
  accountValue: string;
  accountPlaceholder: string;
  accountDisplayValue?: string;
  accountOptions: Option[];
  onAccountChange: (value: string) => void;
  typeValue: string;
  typePlaceholder: string;
  typeDisplayValue?: string;
  typeOptions: Option[];
  onTypeChange: (value: string) => void;
  categoryValue: string;
  categoryPlaceholder: string;
  categoryDisplayValue?: string;
  categoryOptions: Option[];
  onCategoryChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

export function TransactionsFiltersCard({
  title,
  description,
  hasActiveFilters,
  resetLabel,
  onReset,
  keyword,
  searchPlaceholder,
  onKeywordChange,
  accountValue,
  accountPlaceholder,
  accountDisplayValue,
  accountOptions,
  onAccountChange,
  typeValue,
  typePlaceholder,
  typeDisplayValue,
  typeOptions,
  onTypeChange,
  categoryValue,
  categoryPlaceholder,
  categoryDisplayValue,
  categoryOptions,
  onCategoryChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: TransactionsFiltersCardProps) {
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
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder={searchPlaceholder}
        />

        <FilterSelect
          value={accountValue}
          placeholder={accountPlaceholder}
          displayValue={accountDisplayValue}
          options={accountOptions}
          onValueChange={onAccountChange}
        />

        <FilterSelect
          value={typeValue}
          placeholder={typePlaceholder}
          displayValue={typeDisplayValue}
          options={typeOptions}
          onValueChange={onTypeChange}
        />

        <FilterSelect
          value={categoryValue}
          placeholder={categoryPlaceholder}
          displayValue={categoryDisplayValue}
          options={categoryOptions}
          onValueChange={onCategoryChange}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </div>
      </div>
    </SectionCard>
  );
}
