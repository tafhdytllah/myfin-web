import { AuthTokenResponse, LoginRequest, RegisterRequest } from "@/features/auth/types/auth.types";
import { UserResponse } from "@/features/auth/types/user.types";
import { apiRequest } from "@/lib/api/client";
import { ApiResponse } from "@/types/api.types";

export const authApi = {

  async login(request: LoginRequest): Promise<AuthTokenResponse> {
    const response = await apiRequest<ApiResponse<AuthTokenResponse>>("/api/v1/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(request),
    });

    return response.data;
  },

  register(request: RegisterRequest): Promise<void> {
    return apiRequest<ApiResponse<null>>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(request),
    }).then(() => { });
  },

  async refreshSession(): Promise<AuthTokenResponse> {
    const response = await apiRequest<ApiResponse<AuthTokenResponse>>("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    return response.data;
  },

  logout(): Promise<void> {
    return apiRequest<ApiResponse<null>>("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => { });
  },

  async getCurrentUser(accessToken: string): Promise<UserResponse> {
    const response = await apiRequest<ApiResponse<UserResponse>>("/api/v1/users/me", {
      method: "GET",
      accessToken,
    });

    return response.data;
  },

};
