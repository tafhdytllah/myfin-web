import { buildCategoryQuery } from "@/features/categories/api/category-query";
import {
  Category,
  CategoryListFilters,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  UpdateStatusCategoryRequest,
} from "@/features/categories/types/category.types";
import { apiRequest } from "@/lib/api/client";
import { ApiResponse } from "@/types/api.types";

export const categoryApi = {

  async createCategory(accessToken: string, payload: CreateCategoryRequest): Promise<Category> {
    const response = await apiRequest<ApiResponse<Category>>("/api/v1/categories", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateCategory(accessToken: string, id: string, payload: UpdateCategoryRequest): Promise<Category> {
    const response = await apiRequest<ApiResponse<Category>>(`/api/v1/categories/${id}`, {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateStatusCategory(accessToken: string, id: string, payload: UpdateStatusCategoryRequest): Promise<Category> {
    const response = await apiRequest<ApiResponse<Category>>(`/api/v1/categories/${id}/status`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async getCategories(accessToken: string, filters: CategoryListFilters): Promise<ApiResponse<Category[]>> {
    const response = await apiRequest<ApiResponse<Category[]>>(`/api/v1/categories${buildCategoryQuery(filters)}`, {
      method: "GET",
      accessToken,
    });

    return response;
  },

  async getCategory(accessToken: string, id: string): Promise<Category> {
    const response = await apiRequest<ApiResponse<Category>>(`/api/v1/categories/${id}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  deleteCategory(accessToken: string, id: string): Promise<void> {
    return apiRequest<ApiResponse<null>>(`/api/v1/categories/${id}`, {
      method: "DELETE",
      accessToken,
    }).then(() => { });
  },

};
