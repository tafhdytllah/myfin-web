"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/features/auth/services/auth.service";
import { profileKeys } from "@/features/profile/hooks/profile-query-keys";

export function useCurrentProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => authService.getCurrentUser(accessToken as string),
    enabled: Boolean(accessToken),
  });
}