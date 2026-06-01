"use client";

import { authService } from "@/features/auth/services/auth.service";
import { AuthSession } from "@/features/auth/types/auth.types";
import { routes } from "@/lib/constants/routes";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (session: AuthSession) => {
      setSession(session);
      router.replace(routes.dashboard);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.replace(routes.login);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearSession = useAuthStore(
    (state) => state.clearSession,
  );

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace(routes.login);
    },
  });
}
