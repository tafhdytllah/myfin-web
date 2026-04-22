import { CategoryListFilters } from "@/features/categories/types/category-types";

export const categoryStatusOptions = ["all", "active", "inactive"] as const;
export const categoryTypeOptions = ["all", "INCOME", "EXPENSE"] as const;

export function parseCategoryFilters(searchParams: URLSearchParams): CategoryListFilters {
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const statusValue = searchParams.get("status");
  const typeValue = searchParams.get("type");

  const status = categoryStatusOptions.includes(
    statusValue as (typeof categoryStatusOptions)[number],
  )
    ? (statusValue as CategoryListFilters["status"])
    : "all";

  const type = categoryTypeOptions.includes(
    typeValue as (typeof categoryTypeOptions)[number],
  )
    ? (typeValue as CategoryListFilters["type"])
    : "all";

  return {
    keyword,
    status,
    type,
  };
}

export function buildCategorySearchParams(filters: CategoryListFilters) {
  const params = new URLSearchParams();

  if (filters.keyword) {
    params.set("keyword", filters.keyword);
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.type && filters.type !== "all") {
    params.set("type", filters.type);
  }

  return params;
}
