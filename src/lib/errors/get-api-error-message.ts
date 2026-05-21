import { ApiError } from "@/lib/api/api-error";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (ApiError.isApiError(error)) {
    return error.message;
  }

  return fallback;
}
