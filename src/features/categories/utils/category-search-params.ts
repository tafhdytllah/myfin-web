import { CATEGORY_TYPES, CategoryListFilters, categoryTypeToUrl, urlToCategoryType } from "@/features/categories/types/category.types";

export const categoryStatusOptions = ["all", "active", "inactive"] as const;
export const categoryTypeOptions = ["all", ...Object.values(CATEGORY_TYPES)] as const;

export function parseCategoryFilters(searchParams: URLSearchParams): CategoryListFilters {
  const pageValue = Number(searchParams.get("page") ?? "1");
  const sizeValue = Number(searchParams.get("size") ?? "10");

  const raw = searchParams.get("type");
  const type =
    raw && raw in urlToCategoryType
      ? urlToCategoryType[raw as keyof typeof urlToCategoryType]
      : "all";

  const statusValue = searchParams.get("status");
  const status =
    categoryStatusOptions.includes(statusValue as (typeof categoryStatusOptions)[number])
      ? (statusValue as CategoryListFilters["status"])
      : "all";

  return {
    keyword: searchParams.get("keyword")?.trim() ?? "",
    status,
    type,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
    size: Number.isFinite(sizeValue) && sizeValue > 0 ? sizeValue : 10,
  };
}

export function buildCategorySearchParams(filters: CategoryListFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    size: String(filters.size),
  });

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.type && filters.type !== "all") params.set("type", categoryTypeToUrl[filters.type]);

  return params;
}
