import { authApiRepository } from "@/features/auth/repositories/auth-api.repository";
import {
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth-types";

export const authService = {
  async login(payload: LoginPayload) {
    const tokenData = await authApiRepository.login(payload);
    const user = await authApiRepository.getCurrentUser(tokenData.accessToken);

    return {
      accessToken: tokenData.accessToken,
      user,
    }
  },

  async register(payload: RegisterPayload) {
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
