import { UserResponse } from "@/features/auth/types/user.types";

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  expiresIn: number;
};

export type AuthSession = {
  accessToken: string;
  expiresIn: number;
  user: UserResponse;
};
