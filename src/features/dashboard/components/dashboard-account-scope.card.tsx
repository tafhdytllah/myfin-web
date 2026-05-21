import { SectionCard } from "@/components/shared/section-card";
import { FilterSelect } from "@/components/shared/filter-select";

type DashboardAccountScopeCardProps = {
  title: string;
  description: string;
  value: string;
  placeholder: string;
  displayValue?: string;
  allAccountsLabel: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
};

export function DashboardAccountScopeCard({
  title,
  description,
  value,
  placeholder,
  displayValue,
  allAccountsLabel,
  options,
  onValueChange,
}: DashboardAccountScopeCardProps) {
  return (
    <SectionCard title={title} description={description}>
      <div className="max-w-sm">
        <FilterSelect
          value={value}
          placeholder={placeholder}
          displayValue={value === "all" ? allAccountsLabel : displayValue}
          options={[
            { value: "all", label: allAccountsLabel },
            ...options,
          ]}
          onValueChange={onValueChange}
          className="h-11 w-full rounded-2xl"
        />
      </div>
    </SectionCard>
  );
}
