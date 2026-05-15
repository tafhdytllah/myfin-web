"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/auth-service";
import { routes } from "@/lib/constants/routes";
import { useAuthStore } from "@/stores/auth-store";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ accessToken, user }) => {
      setSession({ accessToken, user });
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
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearSession();
      router.replace(routes.login);
    },
  });
}
