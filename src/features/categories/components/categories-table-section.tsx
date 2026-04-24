import { PencilLine, Power, PowerOff } from "lucide-react";

import { EmptySectionCard } from "@/components/shared/empty-section-card";
import { RetryCard } from "@/components/shared/retry-card";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableHeaderCell } from "@/components/shared/table-header-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CategoryItem = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  active: boolean;
  usageCount: number;
};

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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHeaderCell>{labels.category}</TableHeaderCell>
              <TableHeaderCell>{labels.type}</TableHeaderCell>
              <TableHeaderCell>{labels.status}</TableHeaderCell>
              <TableHeaderCell>{labels.used}</TableHeaderCell>
              <TableHeaderCell className="text-right">
                {labels.actions}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <StatusBadge tone={item.type === "INCOME" ? "income" : "expense"}>
                    {item.type === "INCOME" ? labels.income : labels.expense}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={item.active ? "active" : "inactive"}>
                    {item.active ? labels.active : labels.inactive}
                  </StatusBadge>
                </TableCell>
                <TableCell>{item.usageCount}</TableCell>
                <TableCell className="text-right">
                  <RowActionsMenu
                    srLabel={labels.actions}
                    items={[
                      {
                        label: labels.edit,
                        icon: <PencilLine className="size-4" />,
                        onSelect: () => onEdit(item),
                      },
                      item.active
                        ? {
                            label: labels.deactivate,
                            icon: <PowerOff className="size-4" />,
                            onSelect: () => onDeactivate(item),
                          }
                        : {
                            label: labels.activate,
                            icon: <Power className="size-4" />,
                            disabled: activatingPending,
                            onSelect: () => onActivate(item),
                          },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
