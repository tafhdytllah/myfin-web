import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/shared/filter-select";
import { SectionCard } from "@/components/shared/section-card";

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
    <SectionCard title={title} description={description}>
      <div className="grid gap-3 md:grid-cols-3">
        <Input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
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
      </div>
    </SectionCard>
  );
}
