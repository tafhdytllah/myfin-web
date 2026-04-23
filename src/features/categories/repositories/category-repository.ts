import {
  Category,
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/features/categories/types/category-types";

export interface CategoryRepository {
  getCategories(
    accessToken: string,
    filters: CategoryListFilters,
  ): Promise<Category[]>;
  createCategory(
    accessToken: string,
    payload: CreateCategoryPayload,
  ): Promise<Category>;
  updateCategory(
    accessToken: string,
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category>;
}
