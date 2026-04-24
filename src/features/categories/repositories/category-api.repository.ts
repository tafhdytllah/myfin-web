import { apiRequest } from "@/lib/api/client";
import {
  ApiEnvelope,
  Category,
} from "@/features/categories/types/category-types";
import { buildCategoryQuery } from "@/features/categories/repositories/category-api.query";
import { CategoryRepository } from "@/features/categories/repositories/category-repository";

export const categoryApiRepository: CategoryRepository = {
  async getCategories(accessToken, filters) {
    const response = await apiRequest<ApiEnvelope<Category[]>>(
      `/api/v1/categories${buildCategoryQuery(filters)}`,
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },

  async createCategory(accessToken, payload) {
    const response = await apiRequest<ApiEnvelope<Category>>("/api/v1/categories", {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateCategory(accessToken, id, payload) {
    const response = await apiRequest<ApiEnvelope<Category>>(
      `/api/v1/categories/${id}`,
      {
        method: "PUT",
        accessToken,
        body: JSON.stringify(payload),
      },
    );
    console.log(response);
    return response.data;
  },
};
