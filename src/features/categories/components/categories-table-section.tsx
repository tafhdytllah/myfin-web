import { ReactNode, useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { InlineRetryState } from "@/components/shared/inline-retry-state";
import { SectionEmptyState } from "@/components/shared/section-empty-state";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { TableColumnVisibilityMenu } from "@/components/shared/table-column-visibility-menu";
import { TableWorkspace } from "@/components/shared/table-workspace";
import {
  buildCategoriesTableColumns,
  CategoryItem,
} from "@/features/categories/components/categories-table-columns";

type CategoriesTableSectionProps = {
  loading: boolean;
  isError: boolean;
  items: CategoryItem[];
  title: string;
  description: string;
  retryDescription: string;
  retryLabel: string;
  onRetry: () => void;
  emptyDescription: string;
  addLabel: string;
  onAdd: () => void;
  labels: {
    columns: string;
    columnsMenu: string;
    selectedRows: (count: number) => string;
    totalRows: (count: number) => string;
    selectAllRows: string;
    selectCategoryRow: (name: string) => string;
    category: string;
    type: string;
    status: string;
    used: string;
    actions: string;
    income: string;
    expense: string;
    active: string;
    inactive: string;
    edit: string;
    deactivate: string;
    activate: string;
  };
  activatingPending: boolean;
  onEdit: (item: CategoryItem) => void;
  onDeactivate: (item: CategoryItem) => void;
  onActivate: (item: CategoryItem) => void;
  filters: ReactNode;
  primaryAction?: ReactNode;
};

export function CategoriesTableSection({
  loading,
  isError,
  items,
  title,
  description,
  retryDescription,
  retryLabel,
  onRetry,
  emptyDescription,
  addLabel,
  onAdd,
  labels,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
  filters,
  primaryAction,
}: CategoriesTableSectionProps) {
  const columns = useMemo(
    () =>
      buildCategoriesTableColumns({
        labels,
        activatingPending,
        onEdit,
        onDeactivate,
        onActivate,
      }),
    [activatingPending, labels, onActivate, onDeactivate, onEdit],
  );
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [columnPreferences, setColumnPreferences] = useState<string[]>([]);
  const visibleColumnIds = useMemo(() => {
    const nextColumnIds = columns.map((column) => column.id);

    if (columnPreferences.length === 0) {
      return nextColumnIds;
    }

    const preservedIds = columnPreferences.filter((id) => nextColumnIds.includes(id));
    const addedIds = nextColumnIds.filter((id) => !preservedIds.includes(id));

    return [...preservedIds, ...addedIds];
  }, [columnPreferences, columns]);
  const resolvedSelectedRowIds = useMemo(() => {
    const rowIds = new Set(items.map((item) => item.id));

    return selectedRowIds.filter((id) => rowIds.has(id));
  }, [items, selectedRowIds]);

  return (
    <TableWorkspace
      title={title}
      description={description}
      toolbarStart={filters}
      toolbarEnd={
        <>
          {primaryAction}
          <TableColumnVisibilityMenu
            columns={columns}
            visibleColumnIds={visibleColumnIds}
            onVisibleColumnIdsChange={setColumnPreferences}
            triggerLabel={labels.columns}
            menuLabel={labels.columnsMenu}
          />
        </>
      }
      footerStart={
        resolvedSelectedRowIds.length > 0
          ? labels.selectedRows(resolvedSelectedRowIds.length)
          : labels.totalRows(items.length)
      }
    >
      {loading ? <StackSkeleton count={4} itemClassName="h-12 rounded-xl bg-muted" /> : null}

      {isError ? (
        <InlineRetryState
          description={retryDescription}
          retryLabel={retryLabel}
          onRetry={onRetry}
        />
      ) : null}

      {!loading && !isError && items.length === 0 ? (
        <SectionEmptyState
          description={emptyDescription}
          actions={[
            {
              label: addLabel,
              onClick: onAdd,
            },
          ]}
        />
      ) : null}

      {!loading && !isError && items.length > 0 ? (
        <DataTable
          columns={columns}
          rows={items}
          rowKey={(item) => item.id}
          visibleColumnIds={visibleColumnIds}
          selectedRowIds={resolvedSelectedRowIds}
          onSelectedRowIdsChange={setSelectedRowIds}
          selectAllLabel={labels.selectAllRows}
          selectRowLabel={(item) => labels.selectCategoryRow(item.name)}
        />
      ) : null}
    </TableWorkspace>
  );
}
