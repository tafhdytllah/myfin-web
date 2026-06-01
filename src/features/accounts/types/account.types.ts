export type Account = {
  id: string;
  name: string;
  openingBalance: number;
  currentBalance: number;
  active: boolean;
  usageCount: number;
};

export type CreateAccountRequest = {
  name: string;
  openingBalance: number;
};

export type UpdateAccountRequest = {
  name: string;
};

export type UpdateStatusAccountRequest = {
  active: boolean;
};

export type AccountListFilters = {
  keyword?: string;
  status?: "all" | "active" | "inactive";
};
