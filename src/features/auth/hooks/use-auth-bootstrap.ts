"use client";

import { useEffect } from "react";

import { getCurrentUser, refreshSession } from "@/features/auth/api/auth-api";
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
          const user = await getCurrentUser(accessToken);

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
        const tokenData = await refreshSession();
        const user = await getCurrentUser(tokenData.accessToken);

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
