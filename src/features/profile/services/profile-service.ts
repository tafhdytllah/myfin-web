import { profileApiRepository } from "@/features/profile/repositories/profile-api.repository";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile-types";

export const profileService = {
  getCurrentProfile(accessToken: string) {
    return profileApiRepository.getCurrentProfile(accessToken);
  },

  updateProfile(accessToken: string, payload: UpdateProfilePayload) {
    return profileApiRepository.updateProfile(accessToken, payload);
  },

  changePassword(accessToken: string, payload: ChangePasswordPayload) {
    return profileApiRepository.changePassword(accessToken, payload);
  },
};
