import { FilterCardShell } from "@/components/shared/filter-card-shell";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchFilterInput } from "@/components/shared/search-filter-input";

type CategoriesFiltersCardProps = {
  title: string;
  description: string;
  keyword: string;
  searchPlaceholder: string;
  onKeywordChange: (value: string) => void;
  typeValue: string;
  typePlaceholder: string;
  typeDisplayValue?: string;
  typeOptions: Array<{ value: string; label: string }>;
  onTypeChange: (value: string) => void;
  statusValue: string;
  statusPlaceholder: string;
  statusDisplayValue?: string;
  statusOptions: Array<{ value: string; label: string }>;
  onStatusChange: (value: string) => void;
};

export function CategoriesFiltersCard({
  title,
  description,
  keyword,
  searchPlaceholder,
  onKeywordChange,
  typeValue,
  typePlaceholder,
  typeDisplayValue,
  typeOptions,
  onTypeChange,
  statusValue,
  statusPlaceholder,
  statusDisplayValue,
  statusOptions,
  onStatusChange,
}: CategoriesFiltersCardProps) {
  return (
    <FilterCardShell
      title={title}
      description={description}
      className="grid gap-3 md:grid-cols-3"
    >
      <SearchFilterInput
        value={keyword}
        onValueChange={onKeywordChange}
        placeholder={searchPlaceholder}
      />
      <FilterSelect
        value={typeValue}
        placeholder={typePlaceholder}
        displayValue={typeDisplayValue}
        options={typeOptions}
        onValueChange={onTypeChange}
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
