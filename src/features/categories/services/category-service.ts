import { categoryApiRepository } from "@/features/categories/repositories/category-api.repository";
import { ToggleCategoryStatusParams } from "@/features/categories/services/category-service.types";
import {
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/features/categories/types/category-types";

export const categoryService = {
  getCategories(accessToken: string, filters: CategoryListFilters) {
    return categoryApiRepository.getCategories(accessToken, filters);
  },

  createCategory(accessToken: string, payload: CreateCategoryPayload) {
    return categoryApiRepository.createCategory(accessToken, payload);
  },

  updateCategory(
    accessToken: string,
    id: string,
    payload: UpdateCategoryPayload,
  ) {
    return categoryApiRepository.updateCategory(accessToken, id, payload);
  },

  toggleCategoryStatus({
    accessToken,
    category,
    active,
  }: ToggleCategoryStatusParams) {
    return categoryApiRepository.updateCategory(accessToken, category.id, {
      name: category.name,
      type: category.type,
      active,
    });
  },
};
