import { apiRequest } from "@/lib/api/client";
import { ApiEnvelope, ProfileResponse } from "@/features/auth/types/auth-types";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile-types";

export async function updateProfile(
  accessToken: string,
  payload: UpdateProfilePayload,
) {
  const response = await apiRequest<ApiEnvelope<ProfileResponse>>("/api/v1/users/me", {
    method: "PUT",
    accessToken,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function changePassword(
  accessToken: string,
  payload: ChangePasswordPayload,
) {
  const response = await apiRequest<ApiEnvelope<null>>("/api/v1/users/me/password", {
    method: "PUT",
    accessToken,
    body: JSON.stringify(payload),
  });

  return response;
}
