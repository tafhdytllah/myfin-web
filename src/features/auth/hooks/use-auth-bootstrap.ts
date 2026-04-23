"use client";

import { useEffect } from "react";

import { authService } from "@/features/auth/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const startBootstrap = useAuthStore((state) => state.startBootstrap);
  const finishBootstrap = useAuthStore((state) => state.finishBootstrap);
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let isActive = true;

    async function bootstrap() {
      if (hasInitialized) {
        return;
      }

      startBootstrap();

      if (accessToken) {
        try {
          const user = await authService.getCurrentUser(accessToken);

          if (!isActive) {
            return;
          }

          setUser(user);
          finishBootstrap();
          return;
        } catch {
          if (!isActive) {
            return;
          }

          clearSession();
        }
      }

      try {
        const tokenData = await authService.refreshSession();
        const user = await authService.getCurrentUser(tokenData.accessToken);

        if (!isActive) {
          return;
        }

        setSession({
          accessToken: tokenData.accessToken,
          user,
        });
      } catch {
        if (!isActive) {
          return;
        }

        clearSession();
      }
    }

    void bootstrap();

    return () => {
      isActive = false;
    };
  }, [
    accessToken,
    clearSession,
    finishBootstrap,
    hasInitialized,
    setSession,
    setUser,
    startBootstrap,
  ]);
}
