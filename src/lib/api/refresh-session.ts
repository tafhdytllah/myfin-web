import { buildHeaders } from "@/lib/api/headers";
import { TokenEnvelope } from "@/lib/api/types";
import { env } from "@/lib/config/env";
import { routes } from "@/lib/constants/routes";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { useAuthStore } from "@/stores/auth-store";
import { useLocaleStore } from "@/stores/locale-store";
import { toast } from "sonner";

let refreshPromise: Promise<string | null> | null = null;

function getSessionExpiredMessage() {
  const locale = useLocaleStore.getState().locale;

  return dictionaries[locale].auth.sessionExpired;
}

export function shouldAttemptRefresh(path: string) {
  return ![
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/refresh",
    "/api/v1/auth/logout",
  ].includes(path);
}

export async function tryRefreshSession() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as TokenEnvelope;
    const accessToken = payload.data.accessToken;
    useAuthStore.getState().setAccessToken(accessToken);

    return accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export function handleExpiredSession() {
  useAuthStore.getState().clearSession();

  if (typeof window === "undefined") {
    return;
  }

  toast.error(getSessionExpiredMessage());

  if (window.location.pathname !== routes.login) {
    window.location.assign(routes.login);
  }
}
