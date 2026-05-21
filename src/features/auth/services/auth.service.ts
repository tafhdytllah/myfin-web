import { authApi } from "@/features/auth/api/auth.api";
import {
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";

export const authService = {
  async login(payload: LoginPayload) {
    const tokenData = await authApi.login(payload);
    const user = await authApi.getCurrentUser(tokenData.accessToken);

    return {
      accessToken: tokenData.accessToken,
      user,
    }
  },

  register(payload: RegisterPayload) {
    return authApi.register(payload);
  },

  refreshSession() {
    return authApi.refreshSession();
  },

  logout() {
    return authApi.logout();
  },

  getCurrentUser(accessToken: string) {
    return authApi.getCurrentUser(accessToken);
  },
};
