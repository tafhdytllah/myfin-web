import { CategoryListFilters } from "@/features/categories/types/category-types";

export function buildCategoryQuery(filters: CategoryListFilters) {
  const params = new URLSearchParams();

  if (filters.keyword) {
    params.set("keyword", filters.keyword);
  }

  if (filters.type && filters.type !== "all") {
    params.set("type", filters.type);
  }

  if (filters.status === "active") {
    params.set("active", "true");
  }

  if (filters.status === "inactive") {
    params.set("active", "false");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
