"use client";

import { Table } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DataTableFilterOption = {
  label: string;
  value: string;
};

type DataTableFilterSelectProps<TData> = {
  table: Table<TData>;
  columnId: string;
  placeholder: string;
  options: DataTableFilterOption[];
  allValue?: string;
};

export function DataTableFilterSelect<TData>({
  table,
  columnId,
  placeholder,
  options,
  allValue = "all",
}: DataTableFilterSelectProps<TData>) {
  const column = table.getColumn(columnId);

  if (!column) {
    return null;
  }

  return (
    <Select
      value={(column.getFilterValue() as string | undefined) ?? allValue}
      onValueChange={(value) =>
        column.setFilterValue(value === allValue ? undefined : value)
      }
    >
      <SelectTrigger className="h-9 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
