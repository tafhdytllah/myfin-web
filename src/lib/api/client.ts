import { ApiError } from "@/lib/api/api-error";
import { buildHeaders } from "@/lib/api/headers";
import { handleExpiredSession, shouldAttemptRefresh, tryRefreshSession } from "@/lib/api/refresh-session";
import { parseResponsePayload } from "@/lib/api/parse-response";
import { RequestConfig } from "@/lib/api/types";
import { env } from "@/lib/config/env";
import { ApiResponse } from "@/types/api.types";

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
  let payload = await parseResponsePayload<ApiResponse<T>>(response);

  if (
    response.status === 401 &&
    shouldAttemptRefresh(path) &&
    typeof window !== "undefined"
  ) {
    const refreshedToken = await tryRefreshSession();

    if (refreshedToken) {
      response = await makeRequest(refreshedToken);
      payload = await parseResponsePayload<ApiResponse<T>>(response);
    } else {
      handleExpiredSession();
    }
  }

  if (!response.ok) {
    const errorBody = payload.errors;

    throw new ApiError({
      status: response.status,
      code: errorBody?.code,
      message:
        errorBody?.message ??
        response.statusText ??
        "Something went wrong.",
      details: errorBody?.details,
    });
  }

  return payload as T;
}
