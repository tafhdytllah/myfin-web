export const CATEGORY_TYPES = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type CategoryType = typeof CATEGORY_TYPES[keyof typeof CATEGORY_TYPES];

export type CategoryTypeUrl = "income" | "expense";

export const categoryTypeToUrl = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export const urlToCategoryType = {
  income: "INCOME",
  expense: "EXPENSE",
} as const;

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
  page: number;
  size: number;
};
