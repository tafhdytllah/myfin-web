import { apiRequest } from "@/lib/api/client";
import {
  ApiEnvelope,
  AuthTokenData,
  ProfileResponse,
} from "@/features/auth/types/auth-types";
import { AuthRepository } from "@/features/auth/repositories/auth-repository";

export const authApiRepository: AuthRepository = {
  async login(payload) {
    const response = await apiRequest<ApiEnvelope<AuthTokenData>>(
      "/api/v1/auth/login",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async register(payload) {
    await apiRequest<ApiEnvelope<null>>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async refreshSession() {
    const response = await apiRequest<ApiEnvelope<AuthTokenData>>(
      "/api/v1/auth/refresh",
      {
        method: "POST",
        credentials: "include",
      },
    );

    return response.data;
  },

  async logout() {
    await apiRequest<ApiEnvelope<null>>("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },

  async getCurrentUser(accessToken) {
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
