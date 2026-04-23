import { env } from "@/lib/config/env";
import { createApiError } from "@/lib/api/types";
import { routes } from "@/lib/constants/routes";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { useLocaleStore } from "@/stores/locale-store";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

type RequestConfig = RequestInit & {
  accessToken?: string | null;
};

type BackendErrorPayload = {
  errors?: {
    code?: string;
    message?: string;
    details?: Record<string, string | string[]>;
  };
};

type TokenEnvelope = {
  data: {
    accessToken: string;
    expiresIn: number;
  };
};

let refreshPromise: Promise<string | null> | null = null;

function buildHeaders(initHeaders?: HeadersInit, accessToken?: string | null) {
  const headers = new Headers(initHeaders);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

function getSessionExpiredMessage() {
  const locale = useLocaleStore.getState().locale;
  const dictionary = dictionaries[locale];

  if (locale === "id") {
    return dictionary.auth.sessionExpired;
  }

  return dictionary.auth.sessionExpired;
}

function shouldAttemptRefresh(path: string) {
  return ![
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/refresh",
    "/api/v1/auth/logout",
  ].includes(path);
}

async function tryRefreshSession() {
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

function handleExpiredSession() {
  useAuthStore.getState().clearSession();

  if (typeof window === "undefined") {
    return;
  }

  toast.error(getSessionExpiredMessage());

  if (window.location.pathname !== routes.login) {
    window.location.assign(routes.login);
  }
}

async function parseResponsePayload<T>(response: Response) {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  return isJson ? ((await response.json()) as T | BackendErrorPayload) : null;
}

export async function apiRequest<T>(
  path: string,
  { accessToken, ...init }: RequestConfig = {},
): Promise<T> {
  const makeRequest = (token?: string | null) =>
    fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
      ...init,
      headers: buildHeaders(init.headers, token),
    });

  let response = await makeRequest(accessToken);
  let payload = await parseResponsePayload<T>(response);

  if (
    response.status === 401 &&
    shouldAttemptRefresh(path) &&
    typeof window !== "undefined"
  ) {
    const refreshedToken = await tryRefreshSession();

    if (refreshedToken) {
      response = await makeRequest(refreshedToken);
      payload = await parseResponsePayload<T>(response);
    } else {
      handleExpiredSession();
    }
  }

  if (!response.ok) {
    const errorPayload = payload as BackendErrorPayload | null;

    throw createApiError({
      status: response.status,
      code: errorPayload?.errors?.code,
      message:
        errorPayload?.errors?.message ??
        response.statusText ??
        "Something went wrong.",
      details: errorPayload?.errors?.details,
    });
  }

  return payload as T;
}
