"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import {
  DataTableFilterOption,
  DataTableFilterSelect,
} from "@/components/shared/data-table/data-table-filter-select";
import { DataTableViewOptions } from "@/components/shared/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DataTableToolbarFilter = {
  columnId: string;
  placeholder: string;
  options: DataTableFilterOption[];
};

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  columnsLabel: string;
  resetLabel: string;
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
    <div className="max-w-2xl space-y-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_auto] sm:items-center">
        {search && searchColumn ? (
          <Input
            placeholder={search.placeholder}
            value={(searchColumn.getFilterValue() as string | undefined) ?? ""}
            onChange={(event) => searchColumn.setFilterValue(event.target.value)}
            className="h-9 w-full"
          />
        ) : null}
        <div className="flex flex-wrap items-center gap-2 sm:justify-self-start">
          <DataTableViewOptions table={table} label={columnsLabel} />
          {canReset ? (
            <Button variant="outline" size="sm" className="h-8" onClick={resetTable}>
              <X className="size-4" />
              {resetLabel}
            </Button>
          ) : null}
        </div>
      </div>
      {filters.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filters.map((filter) => (
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
