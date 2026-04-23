import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

import { ApiError } from "@/lib/api/types";

export function applyApiFieldErrors<TFieldValues extends FieldValues>(
  error: unknown,
  fields: FieldPath<TFieldValues>[],
  setError: UseFormSetError<TFieldValues>,
) {
  if (!ApiError.isApiError(error)) {
    return false;
  }

  fields.forEach((field) => {
    const message = error.getFieldError(field);

    if (message) {
      setError(field, { message });
    }
  });

  return true;
}
