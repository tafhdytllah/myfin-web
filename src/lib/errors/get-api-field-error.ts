import { ApiError } from "@/lib/api/api-error";

export function getApiFieldError(error: unknown, field: string) {
  if (!ApiError.isApiError(error)) {
    return undefined;
  }

  return error.getFieldError(field);
}
