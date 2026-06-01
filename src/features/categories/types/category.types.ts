export type CategoryType = "INCOME" | "EXPENSE";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  active: boolean;
  usageCount: number;
};

export type CreateCategoryRequest = {
  name: string;
  type: CategoryType;
};

export type UpdateCategoryRequest = {
  name: string;
  type: CategoryType;
};

export type UpdateStatusCategoryRequest = {
  active: boolean;
};

export type CategoryListFilters = {
  keyword?: string;
  status?: "all" | "active" | "inactive";
  type?: "all" | CategoryType;
  page?: number;
  size?: number;
};
