import { authApi } from "@/features/auth/api/auth.api";
import { AuthSession, LoginRequest, RegisterRequest } from "@/features/auth/types/auth.types";

export const authService = {

  async login(request: LoginRequest): Promise<AuthSession> {
    const tokenData = await authApi.login(request);
    const user = await authApi.getCurrentUser(tokenData.accessToken);

    return {
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
      user,
    }
  },

  register(request: RegisterRequest) {
    return authApi.register(request);
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
