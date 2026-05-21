import { User } from "@/stores/auth-store";

export type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type AuthTokenData = {
  accessToken: string;
  expiresIn: number;
};

export type ProfileResponse = User & {
  id?: string;
  role?: string;
  active?: boolean;
};
