import { Account } from "@/features/accounts/types/account-types";

export type ToggleAccountStatusParams = {
  accessToken: string;
  account: Account;
  active: boolean;
};
