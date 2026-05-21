"use client";

import { ReactNode } from "react";
import { DataTable } from "@/components/shared/data-table/table";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import {
  CategoryTableRow,
  useCategoryTableColumns,
} from "@/features/categories/components/category-table.columns";
import { CategoryTableToolbar } from "@/features/categories/components/category-table.toolbar";
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
      {loading ? (
        <StackSkeleton count={6} itemClassName="h-12 rounded-xl bg-muted" />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          toolbar={(table) => <CategoryTableToolbar table={table} />}
        />
      )}
    </SectionCard>
  );
}
