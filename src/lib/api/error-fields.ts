import { isApiError } from "@/lib/api/types";

export function getApiFieldError(error: unknown, field: string) {
  if (!isApiError(error)) {
    return undefined;
  }

  const detail = error.details?.[field];

  if (Array.isArray(detail)) {
    return detail[0];
  }

  return detail;
}
