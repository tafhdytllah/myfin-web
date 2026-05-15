"use client";

import { Column } from "@tanstack/react-table";
import { Check, ListFilter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type DataTableFacetedFilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>;
  title: string;
  options: DataTableFacetedFilterOption[];
  clearLabel: string;
  selectedLabel?: (count: number) => string;
};

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  clearLabel,
  selectedLabel = (count) => String(count),
}: DataTableFacetedFilterProps<TData, TValue>) {
  if (!column) {
    return null;
  }

  const facets = column.getFacetedUniqueValues();
  const filterValue = column.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(filterValue) ? (filterValue as string[]) : [],
  );

  function setSelectedValue(value: string, checked: boolean) {
    const nextSelectedValues = new Set(selectedValues);

    if (checked) {
      nextSelectedValues.add(value);
    } else {
      nextSelectedValues.delete(value);
    }

    const nextFilterValue = Array.from(nextSelectedValues);
    column?.setFilterValue(nextFilterValue.length > 0 ? nextFilterValue : undefined);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <ListFilter className="size-4" />
            {title}
            {selectedValues.size > 0 ? (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
                {selectedLabel(selectedValues.size)}
              </span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);
          const Icon = option.icon;

          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={(checked) => setSelectedValue(option.value, checked)}
            >
              <Check
                className={cn(
                  "size-4 text-primary",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
              />
              {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
              <span>{option.label}</span>
              {facets.get(option.value) ? (
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {facets.get(option.value)}
                </span>
              ) : null}
            </DropdownMenuCheckboxItem>
          );
        })}
        {selectedValues.size > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center"
              onClick={() => column.setFilterValue(undefined)}
            >
              <X className="size-4" />
              {clearLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
