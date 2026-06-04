"use client";

import { categoriesKeys } from "@/features/categories/hooks/category-query-keys";
import { categoryService } from "@/features/categories/services/category.service";
import { CategoryListFilters } from "@/features/categories/types/category.types";
import { useAuthStore } from "@/stores/auth-store";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useCategories(filters: CategoryListFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: categoriesKeys.list(filters),
    queryFn: () => categoryService.getCategories(accessToken as string, filters),
    enabled: Boolean(accessToken),
    placeholderData: keepPreviousData,
  });
}
