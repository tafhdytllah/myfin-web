import {
  ApiEnvelope,
  AuthTokenData,
  LoginPayload,
  ProfileResponse,
  RegisterPayload,
} from "@/features/auth/types/auth.types";
import { apiRequest } from "@/lib/api/client";

export const authApi = {

  async login(payload: LoginPayload): Promise<AuthTokenData> {
    const response = await apiRequest<ApiEnvelope<AuthTokenData>>("/api/v1/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  register(payload: RegisterPayload): Promise<void> {
    return apiRequest<ApiEnvelope<null>>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then(() => { });
  },

  async refreshSession(): Promise<AuthTokenData> {
    const response = await apiRequest<ApiEnvelope<AuthTokenData>>("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    return response.data;
  },

  logout(): Promise<void> {
    return apiRequest<ApiEnvelope<null>>("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => { });
  },

  async getCurrentUser(accessToken: string): Promise<ProfileResponse> {
    const response = await apiRequest<ApiEnvelope<ProfileResponse>>(
      "/api/v1/users/me",
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },

};
