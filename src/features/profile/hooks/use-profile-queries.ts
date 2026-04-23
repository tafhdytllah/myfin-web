"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { profileKeys } from "@/features/profile/hooks/profile-query-keys";
import { profileService } from "@/features/profile/services/profile-service";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile-types";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export function useCurrentProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => profileService.getCurrentProfile(accessToken as string),
    enabled: Boolean(accessToken),
  });
}

export function useUpdateProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileService.updateProfile(accessToken as string, payload),
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
      profileService.changePassword(accessToken as string, payload),
    onSuccess: () => {
      toast.success(t("profile.passwordSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("profile.passwordError")));
    },
  });
}
