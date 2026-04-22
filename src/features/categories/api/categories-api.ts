import { apiRequest } from "@/lib/api/client";
import {
  ApiEnvelope,
  Category,
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/features/categories/types/category-types";

function buildCategoryQuery(filters: CategoryListFilters) {
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

export async function getCategories(
  accessToken: string,
  filters: CategoryListFilters,
) {
  const response = await apiRequest<ApiEnvelope<Category[]>>(
    `/api/v1/categories${buildCategoryQuery(filters)}`,
    {
      method: "GET",
      accessToken,
    },
  );

  return response.data;
}

export async function createCategory(
  accessToken: string,
  payload: CreateCategoryPayload,
) {
  const response = await apiRequest<ApiEnvelope<Category>>("/api/v1/categories", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateCategory(
  accessToken: string,
  id: string,
  payload: UpdateCategoryPayload,
) {
  const response = await apiRequest<ApiEnvelope<Category>>(
    `/api/v1/categories/${id}`,
    {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}
