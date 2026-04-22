export type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

export type Account = {
  id: string;
  name: string;
  openingBalance: number;
  currentBalance: number;
  active: boolean;
  usageCount: number;
};

export type AccountListFilters = {
  keyword?: string;
  status?: "all" | "active" | "inactive";
};

export type CreateAccountPayload = {
  name: string;
  openingBalance: number;
};

export type UpdateAccountPayload = {
  name: string;
  active?: boolean;
};
