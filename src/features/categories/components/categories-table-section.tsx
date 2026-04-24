"use client";

import { useMemo } from "react";

import { CategoriesDataTable } from "@/features/categories/components/categories-data-table";
import {
  buildCategoriesTableColumns,
  CategoryTableRow,
} from "@/features/categories/components/categories-table-columns";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";

type CategoriesTableSectionProps = {
  loading: boolean;
  isError: boolean;
  items: CategoryTableRow[];
  title: string;
  description: string;
  retryTitle: string;
  retryDescription: string;
  retryLabel: string;
  onRetry: () => void;
  labels: {
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
    sortAscending: string;
    sortDescending: string;
    hideColumn: string;
    selectAllRows: string;
    selectCategoryRow: (name: string) => string;
    searchPlaceholder: string;
    typePlaceholder: string;
    statusPlaceholder: string;
    typeAll: string;
    statusAll: string;
    resetFilters: string;
    view: string;
    toggleColumns: string;
    noResults: string;
    rowsSelected: (selected: number, total: number) => string;
    rowsPerPage: string;
    pageOf: (current: number, total: number) => string;
    firstPage: string;
    previousPage: string;
    nextPage: string;
    lastPage: string;
  };
  activatingPending: boolean;
  onEdit: (item: CategoryTableRow) => void;
  onDeactivate: (item: CategoryTableRow) => void;
  onActivate: (item: CategoryTableRow) => void;
};

export function CategoriesTableSection({
  loading,
  isError,
  items,
  title,
  description,
  retryTitle,
  retryDescription,
  retryLabel,
  onRetry,
  labels,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
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

  if (loading) {
    return (
      <SectionCard title={title} description={description}>
        <StackSkeleton count={6} itemClassName="h-12 rounded-xl bg-muted" />
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <RetryCard
        title={retryTitle}
        description={retryDescription}
        retryLabel={retryLabel}
        onRetry={onRetry}
      />
    );
  }

  return (
    <SectionCard title={title} description={description}>
      <CategoriesDataTable columns={columns} data={items} labels={labels} />
    </SectionCard>
  );
}
