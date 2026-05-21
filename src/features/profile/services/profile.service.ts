import { profileApi } from "@/features/profile/api/profile.api";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile.types";

export const profileService = {
  getCurrentProfile(accessToken: string) {
    return profileApi.getCurrentProfile(accessToken);
  },

  updateProfile(accessToken: string, payload: UpdateProfilePayload) {
    return profileApi.updateProfile(accessToken, payload);
  },

  changePassword(accessToken: string, payload: ChangePasswordPayload) {
    return profileApi.changePassword(accessToken, payload);
  },
};
