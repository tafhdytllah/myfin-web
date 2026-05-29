"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import {
  DataTableFacetedFilter,
} from "@/components/data-table/faceted-filter";
import {
  DataTableFilterOption,
  DataTableFilterSelect,
} from "@/components/data-table/filter-select";
import { DataTableViewOptions } from "@/components/data-table/view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DataTableToolbarFilter = {
  columnId: string;
  placeholder: string;
  options: DataTableFilterOption[];
  variant?: "select" | "faceted";
  clearLabel?: string;
  selectedLabel?: (count: number) => string;
};

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  columnsLabel: string;
  resetLabel: string;
  className?: string;
  search?: {
    columnId: string;
    placeholder: string;
  };
  filters?: DataTableToolbarFilter[];
};

export function DataTableToolbar<TData>({
  table,
  columnsLabel,
  resetLabel,
  className,
  search,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const searchColumn = search ? table.getColumn(search.columnId) : undefined;
  const hasActiveFilters = table.getState().columnFilters.length > 0;
  const hasColumnVisibilityChanges =
    Object.keys(table.getState().columnVisibility).length > 0;
  const canReset = hasActiveFilters || hasColumnVisibilityChanges;

  function resetTable() {
    table.resetColumnFilters();
    table.resetColumnVisibility();
    table.resetRowSelection();
  }

  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_auto] sm:items-center">
        <div className="min-w-0">
          {search && searchColumn ? (
            <Input
              placeholder={search.placeholder}
              value={(searchColumn.getFilterValue() as string | undefined) ?? ""}
              onChange={(event) => searchColumn.setFilterValue(event.target.value)}
              className="h-9 w-full"
            />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-self-start">
          {filters.filter((filter) => filter.variant === "faceted")
            .map((filter) => (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={table.getColumn(filter.columnId)}
                title={filter.placeholder}
                options={filter.options}
                clearLabel={filter.clearLabel ?? resetLabel}
                selectedLabel={filter.selectedLabel}
              />
            ))}
          <DataTableViewOptions table={table} label={columnsLabel} />
          {canReset ? (
            <Button variant="outline" size="sm" className="h-8" onClick={resetTable}>
              <X className="size-4" />
              {resetLabel}
            </Button>
          ) : null}
        </div>
      </div>
      {filters.some((filter) => filter.variant !== "faceted") ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filters
            .filter((filter) => filter.variant !== "faceted")
            .map((filter) => (
              <DataTableFilterSelect
                key={filter.columnId}
                table={table}
                columnId={filter.columnId}
                placeholder={filter.placeholder}
                options={filter.options}
              />
            ))}
        </div>
      ) : null}
    </div>
  );
}
