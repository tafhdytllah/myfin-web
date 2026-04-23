"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MoreHorizontal,
  PencilLine,
  Power,
  PowerOff,
  RefreshCw,
} from "lucide-react";
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
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
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
          <Button
            className="h-11 rounded-2xl px-5 text-sm font-semibold max-sm:w-full"
            onClick={openCreateDialog}
          >
            {t("categories.addCategory")}
          </Button>
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
          <SectionCard key={item.label} title={item.label}>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">
              {item.value}
            </p>
          </SectionCard>
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
          <Select
            value={filters.type ?? "all"}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                type: value as "all" | "INCOME" | "EXPENSE",
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.type")}>
                {selectedTypeLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("categories.typeAll")}</SelectItem>
              <SelectItem value="INCOME">{t("common.income")}</SelectItem>
              <SelectItem value="EXPENSE">{t("common.expense")}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.status ?? "all"}
            onValueChange={(value) =>
              updateFilters({
                ...filters,
                status: value as "all" | "active" | "inactive",
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.status")}>
                {selectedStatusLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("categories.statusAll")}</SelectItem>
              <SelectItem value="active">{t("common.active")}</SelectItem>
              <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      {categoriesQuery.isLoading ? (
        <SectionCard
          title={t("categories.tableTitle")}
          description={t("categories.tableDescription")}
        >
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 rounded-xl bg-muted" />
            ))}
          </div>
        </SectionCard>
      ) : null}

      {categoriesQuery.isError ? (
        <SectionCard
          title={t("categories.loadErrorTitle")}
          description={t("categories.loadErrorDescription")}
        >
          <Button
            onClick={() => categoriesQuery.refetch()}
            variant="outline"
            className="rounded-2xl"
          >
            <RefreshCw className="size-4" />
            {t("categories.retry")}
          </Button>
        </SectionCard>
      ) : null}

      {!categoriesQuery.isLoading &&
      !categoriesQuery.isError &&
      categories.length === 0 ? (
        <SectionCard
          title={t("categories.emptyTitle")}
          description={t("categories.emptyDescription")}
        >
          <Button className="rounded-2xl" onClick={openCreateDialog}>
            {t("categories.addCategory")}
          </Button>
        </SectionCard>
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
                  <TableHead className="text-[var(--color-foreground-muted)]">
                    {t("common.category")}
                  </TableHead>
                  <TableHead className="text-[var(--color-foreground-muted)]">
                    {t("common.type")}
                  </TableHead>
                  <TableHead className="text-[var(--color-foreground-muted)]">
                    {t("common.status")}
                  </TableHead>
                  <TableHead className="text-[var(--color-foreground-muted)]">
                    {t("common.used")}
                  </TableHead>
                  <TableHead className="text-right text-[var(--color-foreground-muted)]">
                    {t("common.actions")}
                  </TableHead>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon-sm" />}
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">{t("common.actions")}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(category)}>
                            <PencilLine className="size-4" />
                            {t("common.edit")}
                          </DropdownMenuItem>
                          {category.active ? (
                            <DropdownMenuItem
                              onClick={() => setStatusDialogCategory(category)}
                            >
                              <PowerOff className="size-4" />
                              {t("common.deactivate")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              disabled={toggleStatusMutation.isPending}
                              onClick={() =>
                                toggleStatusMutation.mutate({
                                  category,
                                  active: true,
                                })
                              }
                            >
                              <Power className="size-4" />
                              {t("common.activate")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
