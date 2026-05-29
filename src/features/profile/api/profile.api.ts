import { ApiEnvelope, ProfileResponse } from "@/features/auth/types/auth.types";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile.types";
import { apiRequest } from "@/lib/api/client";

export const profileApi = {

  async updateProfile(
    accessToken: string,
    payload: UpdateProfilePayload,
  ): Promise<ProfileResponse> {
    const response = await apiRequest<ApiEnvelope<ProfileResponse>>(
      "/api/v1/users/me",
      {
        method: "PUT",
        accessToken,
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async changePassword(
    accessToken: string,
    payload: ChangePasswordPayload,
  ): Promise<void> {
    await apiRequest<ApiEnvelope<null>>("/api/v1/users/me/password", {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });
  },
};
