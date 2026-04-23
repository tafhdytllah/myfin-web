import { authApiRepository } from "@/features/auth/repositories/auth-api.repository";
import {
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth-types";

export const authService = {
  login(payload: LoginPayload) {
    return authApiRepository.login(payload);
  },

  register(payload: RegisterPayload) {
    return authApiRepository.register(payload);
  },

  refreshSession() {
    return authApiRepository.refreshSession();
  },

  logout() {
    return authApiRepository.logout();
  },

  getCurrentUser(accessToken: string) {
    return authApiRepository.getCurrentUser(accessToken);
  },
};
