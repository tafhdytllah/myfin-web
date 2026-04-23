import { CategoryListFilters } from "@/features/categories/types/category-types";

export const categoriesKeys = {
  all: ["categories"] as const,
  list: (filters: CategoryListFilters) =>
    ["categories", "list", filters] as const,
};
