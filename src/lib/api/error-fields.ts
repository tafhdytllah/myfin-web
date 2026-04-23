import { ApiError } from "@/lib/api/types";

export function getApiFieldError(error: unknown, field: string) {
  if (!ApiError.isApiError(error)) {
    return undefined;
  }

  return error.getFieldError(field);
}
