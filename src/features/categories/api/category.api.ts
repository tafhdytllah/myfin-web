import { buildCategoryQuery } from "@/features/categories/api/category-query";
import {
  ApiEnvelope,
  Category,
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  UpdateStatusCategoryPayload,
} from "@/features/categories/types/category.types";
import { apiRequest } from "@/lib/api/client";

export const categoryApi = {

  async createCategory(accessToken: string, payload: CreateCategoryPayload): Promise<Category> {
    const response = await apiRequest<ApiEnvelope<Category>>("/api/v1/categories", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateCategory(accessToken: string, id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const response = await apiRequest<ApiEnvelope<Category>>(`/api/v1/categories/${id}`, {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateStatusCategory(accessToken: string, id: string, payload: UpdateStatusCategoryPayload): Promise<Category> {
    const response = await apiRequest<ApiEnvelope<Category>>(`/api/v1/categories/${id}/status`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async getCategories(accessToken: string, filters: CategoryListFilters): Promise<Category[]> {
    const response = await apiRequest<ApiEnvelope<Category[]>>(`/api/v1/categories${buildCategoryQuery(filters)}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  async getCategory(accessToken: string, id: string): Promise<Category> {
    const response = await apiRequest<ApiEnvelope<Category>>(`/api/v1/categories/${id}`, {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

  deleteCategory(accessToken: string, id: string): Promise<void> {
    return apiRequest<ApiEnvelope<null>>(`/api/v1/categories/${id}`, {
      method: "DELETE",
      accessToken,
    }).then(() => { });
  },

};
