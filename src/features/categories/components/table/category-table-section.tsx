"use client";

import { ReactNode } from "react";

import { DataTable } from "@/components/shared/data-table/data-table";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { CategoryTableToolbar } from "@/features/categories/components/table/category-table-toolbar";
import {
  CategoryTableRow,
  useCategoryTableColumns,
} from "@/features/categories/components/table/table-columns";
import { useTranslations } from "@/lib/i18n/use-translations";

type CategoryTableSectionProps = {
  loading: boolean;
  isError: boolean;
  items: CategoryTableRow[];
  onRetry: () => void;
  action?: ReactNode;
  activatingPending: boolean;
  onEdit: (item: CategoryTableRow) => void;
  onDeactivate: (item: CategoryTableRow) => void;
  onActivate: (item: CategoryTableRow) => void;
};

export function CategoryTableSection({
  loading,
  isError,
  items,
  onRetry,
  action,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: CategoryTableSectionProps) {
  const { t } = useTranslations();

  const columns = useCategoryTableColumns({
    activatingPending,
    onEdit,
    onDeactivate,
    onActivate,
  });

  if (loading) {
    return (
      <SectionCard
        title={t("categories.title")}
        description={t("categories.description")}
        action={action}
      >
        <StackSkeleton count={6} itemClassName="h-12 rounded-xl bg-muted" />
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <RetryCard
        title={t("categories.loadErrorTitle")}
        description={t("categories.loadErrorDescription")}
        retryLabel={t("categories.retry")}
        onRetry={onRetry}
      />
    );
  }

  return (
    <SectionCard
      title={t("categories.title")}
      description={t("categories.description")}
      action={action}
    >
      <DataTable
        columns={columns}
        data={items}
        noResultsLabel={t("common.noResults")}
        toolbar={(table) => <CategoryTableToolbar table={table} />}
      />
    </SectionCard>
  );
}
