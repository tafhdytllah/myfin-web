import { categoryApi } from "@/features/categories/api/category.api";
import {
  CategoryListFilters,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  UpdateStatusCategoryRequest,
} from "@/features/categories/types/category.types";

export const categoryService = {

  createCategory(accessToken: string, payload: CreateCategoryRequest) {
    return categoryApi.createCategory(accessToken, payload);
  },

  updateCategory(accessToken: string, id: string, payload: UpdateCategoryRequest) {
    return categoryApi.updateCategory(accessToken, id, payload);
  },

  updateStatusCategory(accessToken: string, id: string, payload: UpdateStatusCategoryRequest) {
    return categoryApi.updateStatusCategory(accessToken, id, payload);
  },

  async getCategories(accessToken: string, filters: CategoryListFilters) {
    const response = await categoryApi.getCategories(accessToken, filters);

    return {
      items: response.data,
      meta: response.meta,
    }
  },

  getCategory(accessToken: string, id: string) {
    return categoryApi.getCategory(accessToken, id);
  },

  deleteCategory(accessToken: string, id: string) {
    return categoryApi.deleteCategory(accessToken, id);
  },

};
