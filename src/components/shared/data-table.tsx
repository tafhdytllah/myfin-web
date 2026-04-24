import { ReactNode } from "react";

import { TableHeaderCell } from "@/components/shared/table-header-cell";
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
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: TRow) => ReactNode;
};

type DataTableProps<TRow> = {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  rowKey: (row: TRow) => string;
  minWidthClassName?: string;
};

export function DataTable<TRow>({
  columns,
  rows,
  rowKey,
  minWidthClassName,
}: DataTableProps<TRow>) {
  return (
    <div className="overflow-x-auto">
      <Table className={cn(minWidthClassName)}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
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
              {columns.map((column) => (
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
