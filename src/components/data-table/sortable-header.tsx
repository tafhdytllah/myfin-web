import { Column } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./column-header";

type SortableHeaderOptions = {
  title: string;
  ascLabel: string;
  descLabel: string;
  hideLabel: string;
};

export function sortableHeader<TData, TValue>({
  title,
  ascLabel,
  descLabel,
  hideLabel,
}: SortableHeaderOptions) {
  return function Header({
    column,
  }: {
    column: Column<TData, TValue>;
  }) {
    return (
      <DataTableColumnHeader
        column={column}
        title={title}
        ascLabel={ascLabel}
        descLabel={descLabel}
        hideLabel={hideLabel}
      />
    );
  };
}