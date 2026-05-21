import { ApiError } from "@/lib/api/api-error";
import { BackendErrorPayload } from "@/lib/api/error-response.types";
import { buildHeaders } from "@/lib/api/headers";
import { handleExpiredSession, shouldAttemptRefresh, tryRefreshSession } from "@/lib/api/refresh-session";
import { parseResponsePayload } from "@/lib/api/parse-response";
import { RequestConfig } from "@/lib/api/types";
import { env } from "@/lib/config/env";

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
  let payload = await parseResponsePayload<T | BackendErrorPayload>(response);

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
