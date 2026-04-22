export type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

export type CategoryType = "INCOME" | "EXPENSE";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  active: boolean;
  usageCount: number;
};

export type CategoryListFilters = {
  keyword?: string;
  status?: "all" | "active" | "inactive";
  type?: "all" | CategoryType;
};

export type CreateCategoryPayload = {
  name: string;
  type: CategoryType;
};

export type UpdateCategoryPayload = {
  name: string;
  type: CategoryType;
  active?: boolean;
};
