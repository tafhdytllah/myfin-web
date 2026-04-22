"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getCurrentUser, login, logout, register } from "@/features/auth/api/auth-api";
import {
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth-types";
import { routes } from "@/lib/constants/routes";
import { useAuthStore } from "@/stores/auth-store";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const tokenData = await login(payload);
      const user = await getCurrentUser(tokenData.accessToken);

      return {
        accessToken: tokenData.accessToken,
        user,
      };
    },
    onSuccess: ({ accessToken, user }) => {
      setSession({ accessToken, user });
      router.replace(routes.dashboard);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      router.replace(routes.login);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      router.replace(routes.login);
    },
  });
}
