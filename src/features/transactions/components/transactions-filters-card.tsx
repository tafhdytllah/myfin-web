import { DateRangeFields } from "@/components/shared/date-range-fields";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchFilterInput } from "@/components/shared/search-filter-input";

type Option = {
  value: string;
  label: string;
};

type TransactionsFiltersCardProps = {
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
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <SearchFilterInput
        value={keyword}
        onValueChange={onKeywordChange}
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

      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
    </div>
  );
}
