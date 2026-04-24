"use client";

import { Table } from "@tanstack/react-table";

import { CategoriesDataTableViewOptions } from "@/features/categories/components/categories-data-table-view-options";
import { FilterSelect } from "@/components/shared/filter-select";
import { ResetFiltersButton } from "@/components/shared/reset-filters-button";
import { SearchFilterInput } from "@/components/shared/search-filter-input";

type CategoriesDataTableToolbarProps<TData> = {
  table: Table<TData>;
  labels: {
    searchPlaceholder: string;
    typePlaceholder: string;
    statusPlaceholder: string;
    typeAll: string;
    statusAll: string;
    income: string;
    expense: string;
    active: string;
    inactive: string;
    resetFilters: string;
    view: string;
    toggleColumns: string;
  };
};

export function CategoriesDataTableToolbar<TData>({
  table,
  labels,
}: CategoriesDataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const nameColumn = table.getColumn("name");
  const typeColumn = table.getColumn("type");
  const statusColumn = table.getColumn("status");

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 gap-3 md:grid-cols-3">
        <SearchFilterInput
          value={(nameColumn?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => nameColumn?.setFilterValue(value)}
          placeholder={labels.searchPlaceholder}
        />
        <FilterSelect
          value={(typeColumn?.getFilterValue() as string) ?? "all"}
          placeholder={labels.typePlaceholder}
          options={[
            { value: "all", label: labels.typeAll },
            { value: "INCOME", label: labels.income },
            { value: "EXPENSE", label: labels.expense },
          ]}
          onValueChange={(value) =>
            typeColumn?.setFilterValue(value === "all" ? undefined : value)
          }
        />
        <FilterSelect
          value={(statusColumn?.getFilterValue() as string) ?? "all"}
          placeholder={labels.statusPlaceholder}
          options={[
            { value: "all", label: labels.statusAll },
            { value: "active", label: labels.active },
            { value: "inactive", label: labels.inactive },
          ]}
          onValueChange={(value) =>
            statusColumn?.setFilterValue(value === "all" ? undefined : value)
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isFiltered ? (
          <ResetFiltersButton
            label={labels.resetFilters}
            onClick={() => table.resetColumnFilters()}
          />
        ) : null}
        <CategoriesDataTableViewOptions
          table={table}
          labels={{
            view: labels.view,
            toggleColumns: labels.toggleColumns,
          }}
        />
      </div>
    </div>
  );
}
