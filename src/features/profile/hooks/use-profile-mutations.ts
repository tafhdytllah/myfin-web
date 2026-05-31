import { ChangePasswordUserRequest, UpdateUserRequest } from "@/features/auth/types/user.types";
import { profileKeys } from "@/features/profile/hooks/profile-query-keys";
import { profileService } from "@/features/profile/services/profile.service";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateProfile() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: UpdateUserRequest) =>
      profileService.updateProfile(
        accessToken as string,
        payload
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: profileKeys.current(),
      });
      toast.success(t("profile.updateSuccess"));
    },
  });
}

export function useChangePassword() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: ChangePasswordUserRequest) =>
      profileService.changePassword(
        accessToken as string,
        payload
      ),
    onSuccess: () => {
      toast.success(t("profile.passwordSuccess"));
    },
  });
}
