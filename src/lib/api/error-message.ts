import { isApiError } from "@/lib/api/types";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) {
    return error.message;
  }

  return fallback;
}
