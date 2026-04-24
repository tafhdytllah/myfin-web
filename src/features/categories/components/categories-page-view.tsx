"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PencilLine, Power, PowerOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { CategoryStatusDialog } from "@/features/categories/components/category-status-dialog";
import { Category } from "@/features/categories/types/category-types";
import {
  useCategories,
  useToggleCategoryStatus,
} from "@/features/categories/hooks/use-category-queries";
import {
  buildCategorySearchParams,
  parseCategoryFilters,
} from "@/features/categories/utils/category-search-params";
import { EmptySectionCard } from "@/components/shared/empty-section-card";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageActionButton } from "@/components/shared/page-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { RetryCard } from "@/components/shared/retry-card";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { SummaryStatCard } from "@/components/shared/summary-stat-card";
import { TableHeaderCell } from "@/components/shared/table-header-cell";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTranslations } from "@/lib/i18n/use-translations";

export function CategoriesPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslations();
  const filters = useMemo(
    () => parseCategoryFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const categoriesQuery = useCategories(filters);
  const toggleStatusMutation = useToggleCategoryStatus();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [statusDialogCategory, setStatusDialogCategory] = useState<Category | null>(null);
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  const debouncedKeyword = useDebouncedValue(keyword);

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const selectedTypeLabel = useMemo(() => {
    switch (filters.type) {
      case "INCOME":
        return t("common.income");
      case "EXPENSE":
        return t("common.expense");
      default:
        return t("categories.typeAll");
    }
  }, [filters.type, t]);
  const selectedStatusLabel = useMemo(() => {
    switch (filters.status) {
      case "active":
        return t("common.active");
      case "inactive":
        return t("common.inactive");
      default:
        return t("categories.statusAll");
    }
  }, [filters.status, t]);
  const modalTrail = useMemo(() => {
    if (statusDialogCategory) {
      return t("common.deactivate");
    }

    if (formOpen && editingCategory) {
      return t("common.edit");
    }

    if (formOpen) {
      return t("common.create");
    }

    return null;
  }, [editingCategory, formOpen, statusDialogCategory, t]);

  usePageTrail([modalTrail]);

  const summary = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((category) => category.active).length,
      inactive: categories.filter((category) => !category.active).length,
      income: categories.filter((category) => category.type === "INCOME").length,
      expense: categories.filter((category) => category.type === "EXPENSE").length,
    }),
    [categories],
  );

  const updateFilters = useCallback((nextFilters: typeof filters) => {
    const params = buildCategorySearchParams(nextFilters);
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    if (debouncedKeyword === (filters.keyword ?? "")) {
      return;
    }

    updateFilters({
      ...filters,
      keyword: debouncedKeyword,
    });
  }, [debouncedKeyword, filters, updateFilters]);

  function openCreateDialog() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("categories.title")}
        description={t("categories.description")}
        action={
          <PageActionButton onClick={openCreateDialog}>
            {t("categories.addCategory")}
          </PageActionButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: t("categories.total"), value: String(summary.total) },
          { label: t("common.active"), value: String(summary.active) },
          { label: t("common.inactive"), value: String(summary.inactive) },
          { label: t("common.income"), value: String(summary.income) },
          { label: t("common.expense"), value: String(summary.expense) },
        ].map((item) => (
          <SummaryStatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <SectionCard
        title={t("categories.searchTitle")}
        description={t("categories.searchDescription")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={t("categories.searchPlaceholder")}
          />
          <FilterSelect
            value={filters.type ?? "all"}
            placeholder={t("common.type")}
            displayValue={selectedTypeLabel}
            options={[
              { value: "all", label: t("categories.typeAll") },
              { value: "INCOME", label: t("common.income") },
              { value: "EXPENSE", label: t("common.expense") },
            ]}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                type: value as "all" | "INCOME" | "EXPENSE",
              })
            }
          />
          <FilterSelect
            value={filters.status ?? "all"}
            placeholder={t("common.status")}
            displayValue={selectedStatusLabel}
            options={[
              { value: "all", label: t("categories.statusAll") },
              { value: "active", label: t("common.active") },
              { value: "inactive", label: t("common.inactive") },
            ]}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                status: value as "all" | "active" | "inactive",
              })
            }
          />
        </div>
      </SectionCard>

      {categoriesQuery.isLoading ? (
        <SectionCard
          title={t("categories.tableTitle")}
          description={t("categories.tableDescription")}
        >
          <StackSkeleton count={4} itemClassName="h-12 rounded-xl bg-muted" />
        </SectionCard>
      ) : null}

      {categoriesQuery.isError ? (
        <RetryCard
          title={t("categories.loadErrorTitle")}
          description={t("categories.loadErrorDescription")}
          retryLabel={t("categories.retry")}
          onRetry={() => categoriesQuery.refetch()}
        />
      ) : null}

      {!categoriesQuery.isLoading &&
      !categoriesQuery.isError &&
      categories.length === 0 ? (
        <EmptySectionCard
          title={t("categories.emptyTitle")}
          description={t("categories.emptyDescription")}
          actions={[
            {
              label: t("categories.addCategory"),
              onClick: openCreateDialog,
            },
          ]}
        />
      ) : null}

      {!categoriesQuery.isLoading &&
      !categoriesQuery.isError &&
      categories.length > 0 ? (
        <SectionCard
          title={t("categories.tableTitle")}
          description={t("categories.tableDescription")}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHeaderCell>{t("common.category")}</TableHeaderCell>
                  <TableHeaderCell>{t("common.type")}</TableHeaderCell>
                  <TableHeaderCell>{t("common.status")}</TableHeaderCell>
                  <TableHeaderCell>{t("common.used")}</TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    {t("common.actions")}
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <StatusBadge
                        tone={category.type === "INCOME" ? "income" : "expense"}
                      >
                        {category.type === "INCOME"
                          ? t("common.income")
                          : t("common.expense")}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={category.active ? "active" : "inactive"}>
                        {category.active ? t("common.active") : t("common.inactive")}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{category.usageCount}</TableCell>
                    <TableCell className="text-right">
                      <RowActionsMenu
                        srLabel={t("common.actions")}
                        items={[
                          {
                            label: t("common.edit"),
                            icon: <PencilLine className="size-4" />,
                            onSelect: () => openEditDialog(category),
                          },
                          category.active
                            ? {
                                label: t("common.deactivate"),
                                icon: <PowerOff className="size-4" />,
                                onSelect: () => setStatusDialogCategory(category),
                              }
                            : {
                                label: t("common.activate"),
                                icon: <Power className="size-4" />,
                                disabled: toggleStatusMutation.isPending,
                                onSelect: () =>
                                  toggleStatusMutation.mutate({
                                    category,
                                    active: true,
                                  }),
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
      ) : null}

      <CategoryFormDialog
        category={editingCategory}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
      <CategoryStatusDialog
        category={statusDialogCategory}
        open={Boolean(statusDialogCategory)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusDialogCategory(null);
          }
        }}
      />
    </div>
  );
}
