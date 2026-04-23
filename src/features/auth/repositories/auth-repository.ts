import {
  AuthTokenData,
  LoginPayload,
  ProfileResponse,
  RegisterPayload,
} from "@/features/auth/types/auth-types";

export interface AuthRepository {
  login(payload: LoginPayload): Promise<AuthTokenData>;
  register(payload: RegisterPayload): Promise<void>;
  refreshSession(): Promise<AuthTokenData>;
  logout(): Promise<void>;
  getCurrentUser(accessToken: string): Promise<ProfileResponse>;
}
