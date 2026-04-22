import { env } from "@/lib/config/env";
import { ApiError } from "@/lib/api/types";

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

export async function apiRequest<T>(
  path: string,
  { accessToken, ...init }: RequestConfig = {},
): Promise<T> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init.headers, accessToken),
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? ((await response.json()) as T | BackendErrorPayload) : null;

  if (!response.ok) {
    const errorPayload = payload as BackendErrorPayload | null;

    throw new ApiError({
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
