
import { ChangePasswordUserRequest, UpdateUserRequest, UserResponse } from "@/features/auth/types/user.types";
import { apiRequest } from "@/lib/api/client";
import { ApiResponse } from "@/types/api.types";

export const profileApi = {

  async updateUser(accessToken: string, payload: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiRequest<ApiResponse<UserResponse>>("/api/v1/users/me", {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async changePasswordUser(accessToken: string, payload: ChangePasswordUserRequest): Promise<void> {
    await apiRequest<ApiResponse<null>>("/api/v1/users/me/password", {
      method: "PUT",
      accessToken,
      body: JSON.stringify(payload),
    });
  },
};
