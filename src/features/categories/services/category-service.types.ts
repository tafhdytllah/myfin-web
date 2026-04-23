import { Category } from "@/features/categories/types/category-types";

export type ToggleCategoryStatusParams = {
  accessToken: string;
  category: Category;
  active: boolean;
};
