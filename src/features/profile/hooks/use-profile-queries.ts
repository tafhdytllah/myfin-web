"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCurrentUser } from "@/features/auth/api/auth-api";
import {
  changePassword,
  updateProfile,
} from "@/features/profile/api/profile-api";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile-types";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export const profileKeys = {
  all: ["profile"] as const,
  current: () => ["profile", "current"] as const,
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function useCurrentProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => getCurrentUser(accessToken as string),
    enabled: Boolean(accessToken),
  });
}

export function useUpdateProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      updateProfile(accessToken as string, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.current() });
      toast.success(t("profile.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("profile.updateError")));
    },
  });
}

export function useChangePassword() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changePassword(accessToken as string, payload),
    onSuccess: () => {
      toast.success(t("profile.passwordSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("profile.passwordError")));
    },
  });
}
