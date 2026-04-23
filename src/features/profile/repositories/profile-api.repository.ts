import { apiRequest } from "@/lib/api/client";
import { ApiEnvelope, ProfileResponse } from "@/features/auth/types/auth-types";
import { ProfileRepository } from "@/features/profile/repositories/profile-repository";

export const profileApiRepository: ProfileRepository = {
  async getCurrentProfile(accessToken) {
    const response = await apiRequest<ApiEnvelope<ProfileResponse>>(
      "/api/v1/users/me",
      {
        method: "GET",
        accessToken,
      },
    );

    return response.data;
  },

  async updateProfile(accessToken, payload) {
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

  async changePassword(accessToken, payload) {
    await apiRequest<ApiEnvelope<null>>("/api/v1/users/me/password", {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });
  },
};
