"use client";

import { SlidersHorizontal } from "lucide-react";

import { DataTableColumn } from "@/components/shared/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type TableColumnVisibilityMenuProps<TRow> = {
  columns: DataTableColumn<TRow>[];
  visibleColumnIds: string[];
  onVisibleColumnIdsChange: (ids: string[]) => void;
  triggerLabel: string;
  menuLabel: string;
};

export function TableColumnVisibilityMenu<TRow>({
  columns,
  visibleColumnIds,
  onVisibleColumnIdsChange,
  triggerLabel,
  menuLabel,
}: TableColumnVisibilityMenuProps<TRow>) {
  const hideableColumns = columns.filter((column) => column.canHide !== false);

  if (hideableColumns.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="h-11 rounded-2xl px-4 text-sm">
            <SlidersHorizontal className="size-4" />
            {triggerLabel}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => {
          const checked = visibleColumnIds.includes(column.id);
          const nextIds = checked
            ? visibleColumnIds.filter((id) => id !== column.id)
            : [...visibleColumnIds, column.id];

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={checked}
              disabled={checked && visibleColumnIds.length === 1}
              onCheckedChange={() => onVisibleColumnIdsChange(nextIds)}
            >
              {column.visibilityLabel ?? column.header}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
