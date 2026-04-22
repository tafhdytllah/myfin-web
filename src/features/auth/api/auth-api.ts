import { apiRequest } from "@/lib/api/client";
import {
  ApiEnvelope,
  AuthTokenData,
  LoginPayload,
  ProfileResponse,
  RegisterPayload,
} from "@/features/auth/types/auth-types";

export async function login(payload: LoginPayload) {
  const response = await apiRequest<ApiEnvelope<AuthTokenData>>("/api/v1/auth/login", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiRequest<ApiEnvelope<null>>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response;
}

export async function refreshSession() {
  const response = await apiRequest<ApiEnvelope<AuthTokenData>>("/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  return response.data;
}

export async function logout() {
  return apiRequest<ApiEnvelope<null>>("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser(accessToken: string) {
  const response = await apiRequest<ApiEnvelope<ProfileResponse>>("/api/v1/users/me", {
    method: "GET",
    accessToken,
  });

  return response.data;
}
