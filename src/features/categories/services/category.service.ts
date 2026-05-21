import { categoryApi } from "@/features/categories/api/category.api";
import {
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  UpdateStatusCategoryPayload,
} from "@/features/categories/types/category.types";

export const categoryService = {

  createCategory(accessToken: string, payload: CreateCategoryPayload) {
    return categoryApi.createCategory(accessToken, payload);
  },

  updateCategory(accessToken: string, id: string, payload: UpdateCategoryPayload) {
    return categoryApi.updateCategory(accessToken, id, payload);
  },

  updateStatusCategory(accessToken: string, id: string, payload: UpdateStatusCategoryPayload) {
    return categoryApi.updateStatusCategory(accessToken, id, payload);
  },

  getCategories(accessToken: string, filters: CategoryListFilters) {
    return categoryApi.getCategories(accessToken, filters);
  },

  getCategory(accessToken: string, id: string) {
    return categoryApi.getCategory(accessToken, id);
  },

  deleteCategory(accessToken: string, id: string) {
    return categoryApi.deleteCategory(accessToken, id);
  },

};
