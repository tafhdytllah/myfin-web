"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  Table as ReactTable,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, ReactNode, useState } from "react";

import { DataTablePagination } from "@/components/data-table/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "@/lib/i18n/use-translations";
import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  toolbar?: (table: ReactTable<TData>) => ReactNode;
  customToolbar?: (table: ReactTable<TData>) => ReactNode;
  className?: string;
  pagination?: (table: ReactTable<TData>) => ReactNode;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  paginationState?: PaginationState;
  setPaginationState?: React.Dispatch<React.SetStateAction<PaginationState>>;
  total?: number;
  loading?: boolean;
  initialColumnVisibility?: VisibilityState;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  renderSubComponent?: (row: Row<TData>) => ReactNode;
  bordered?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  toolbar,
  customToolbar,
  className,
  pagination,
  sorting: controlledSorting,
  setSorting: setControlledSorting,
  columnFilters: controlledColumnFilters,
  setColumnFilters: setControlledColumnFilters,
  paginationState: controlledPagination,
  setPaginationState: setControlledPagination,
  total,
  loading = false,
  initialColumnVisibility,
  rowSelection: controlledRowSelection,
  setRowSelection: setControlledRowSelection,
  getSubRows,
  renderSubComponent,
  bordered = false,
  manualSorting = false,
  manualFiltering = false,
  manualPagination,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslations();

  const [localSorting, setLocalSorting] = useState<SortingState>([]);
  const [localColumnFilters, setLocalColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility ?? {},
  );
  const [localRowSelection, setLocalRowSelection] = useState<RowSelectionState>({});
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const sorting = controlledSorting ?? localSorting;
  const setSorting = setControlledSorting ?? setLocalSorting;
  const columnFilters = controlledColumnFilters ?? localColumnFilters;
  const setColumnFilters = setControlledColumnFilters ?? setLocalColumnFilters;
  const rowSelection = controlledRowSelection ?? localRowSelection;
  const setRowSelection = setControlledRowSelection ?? setLocalRowSelection;
  const tablePagination = controlledPagination ?? localPagination;
  const setTablePagination = setControlledPagination ?? setLocalPagination;
  const isManualPagination =
    manualPagination ?? Boolean(controlledPagination && setControlledPagination);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getSubRows ? getExpandedRowModel() : undefined,
    getSubRows,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onPaginationChange: setTablePagination,
    enableExpanding: Boolean(getSubRows),
    paginateExpandedRows: false,
    manualSorting,
    manualFiltering,
    manualPagination: isManualPagination,
    pageCount: isManualPagination
      ? Math.max(Math.ceil((total ?? data.length) / tablePagination.pageSize), 1)
      : undefined,
    enableSorting: !loading,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: tablePagination,
      expanded,
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      {customToolbar ? customToolbar(table) : null}
      {toolbar ? toolbar(table) : null}

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card text-card-foreground">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className={cn("hover:bg-transparent", bordered && "border-b-2")}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(bordered && "border-l first:border-l-0")}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: tablePagination.pageSize }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {table.getVisibleLeafColumns().map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(bordered && "border-l first:border-l-0")}
                      >
                        <Skeleton className="h-5 w-3/5 rounded-sm" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(bordered && "border-l first:border-l-0")}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && renderSubComponent ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={row.getVisibleCells().length}>
                          {renderSubComponent(row)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t("common.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination ? pagination(table) : <DataTablePagination table={table} />}
    </div>
  );
}
