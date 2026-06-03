import { CategoryListFilters, categoryTypeToUrl } from "@/features/categories/types/category.types";

export function buildCategoryQuery(filters: CategoryListFilters) {
  const params = new URLSearchParams({
    page: String(filters.page - 1),
    size: String(filters.size),
  });

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.type && filters.type !== "all") params.set("type", categoryTypeToUrl[filters.type]);
  if (filters.status === "active") params.set("active", "true");
  if (filters.status === "inactive") params.set("active", "false");

  return params.toString();
}
