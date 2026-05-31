import { ChangePasswordUserRequest, UpdateUserRequest } from "@/features/auth/types/user.types";
import { profileApi } from "@/features/profile/api/profile.api";

export const profileService = {

  updateProfile(accessToken: string, request: UpdateUserRequest) {
    return profileApi.updateUser(accessToken, request);
  },

  changePassword(accessToken: string, request: ChangePasswordUserRequest) {
    return profileApi.changePasswordUser(accessToken, request);
  },
};
