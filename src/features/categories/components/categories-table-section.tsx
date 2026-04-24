import { DataTable } from "@/components/shared/data-table";
import { EmptySectionCard } from "@/components/shared/empty-section-card";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
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
  retryTitle: string;
  retryDescription: string;
  retryLabel: string;
  onRetry: () => void;
  emptyTitle: string;
  emptyDescription: string;
  addLabel: string;
  onAdd: () => void;
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
  };
  activatingPending: boolean;
  onEdit: (item: CategoryItem) => void;
  onDeactivate: (item: CategoryItem) => void;
  onActivate: (item: CategoryItem) => void;
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
  emptyTitle,
  emptyDescription,
  addLabel,
  onAdd,
  labels,
  activatingPending,
  onEdit,
  onDeactivate,
  onActivate,
}: CategoriesTableSectionProps) {
  const columns = buildCategoriesTableColumns({
    labels,
    activatingPending,
    onEdit,
    onDeactivate,
    onActivate,
  });

  if (loading) {
    return (
      <SectionCard title={title} description={description}>
        <StackSkeleton count={4} itemClassName="h-12 rounded-xl bg-muted" />
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

  if (items.length === 0) {
    return (
      <EmptySectionCard
        title={emptyTitle}
        description={emptyDescription}
        actions={[
          {
            label: addLabel,
            onClick: onAdd,
          },
        ]}
      />
    );
  }

  return (
    <SectionCard title={title} description={description}>
      <DataTable columns={columns} rows={items} rowKey={(item) => item.id} />
    </SectionCard>
  );
}
