import { ProfileResponse } from "@/features/auth/types/auth-types";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile-types";

export interface ProfileRepository {
  getCurrentProfile(accessToken: string): Promise<ProfileResponse>;
  updateProfile(
    accessToken: string,
    payload: UpdateProfilePayload,
  ): Promise<ProfileResponse>;
  changePassword(
    accessToken: string,
    payload: ChangePasswordPayload,
  ): Promise<void>;
}
