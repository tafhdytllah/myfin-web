import { ReactNode } from "react";

import { TableHeaderCell } from "@/components/shared/table-header-cell";
import { TableSelectCheckbox } from "@/components/shared/table-select-checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<TRow> = {
  id: string;
  header: ReactNode;
  visibilityLabel?: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  canHide?: boolean;
  cell: (row: TRow) => ReactNode;
};

type DataTableProps<TRow> = {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  rowKey: (row: TRow) => string;
  minWidthClassName?: string;
  visibleColumnIds?: string[];
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  selectAllLabel?: string;
  selectRowLabel?: (row: TRow) => string;
};

export function DataTable<TRow>({
  columns,
  rows,
  rowKey,
  minWidthClassName,
  visibleColumnIds,
  selectedRowIds = [],
  onSelectedRowIdsChange,
  selectAllLabel = "Select all rows",
  selectRowLabel,
}: DataTableProps<TRow>) {
  const visibleColumns =
    visibleColumnIds && visibleColumnIds.length > 0
      ? columns.filter((column) => visibleColumnIds.includes(column.id))
      : columns;
  const rowIds = rows.map((row) => rowKey(row));
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedRowIds.includes(id));
  const someSelected = rowIds.some((id) => selectedRowIds.includes(id)) && !allSelected;

  return (
    <div className="overflow-x-auto">
      <Table className={cn(minWidthClassName)}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {onSelectedRowIdsChange ? (
              <TableHeaderCell className="w-10">
                <TableSelectCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  ariaLabel={selectAllLabel}
                  onCheckedChange={(checked) =>
                    onSelectedRowIdsChange(checked ? rowIds : [])
                  }
                />
              </TableHeaderCell>
            ) : null}
            {visibleColumns.map((column) => (
              <TableHeaderCell
                key={column.id}
                className={column.headerClassName}
              >
                {column.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rowKey(row)}>
              {onSelectedRowIdsChange ? (
                <TableCell className="w-10">
                  <TableSelectCheckbox
                    checked={selectedRowIds.includes(rowKey(row))}
                    ariaLabel={selectRowLabel?.(row) ?? "Select row"}
                    onCheckedChange={(checked) =>
                      onSelectedRowIdsChange(
                        checked
                          ? [...selectedRowIds, rowKey(row)]
                          : selectedRowIds.filter((id) => id !== rowKey(row)),
                      )
                    }
                  />
                </TableCell>
              ) : null}
              {visibleColumns.map((column) => (
                <TableCell key={column.id} className={column.cellClassName}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
