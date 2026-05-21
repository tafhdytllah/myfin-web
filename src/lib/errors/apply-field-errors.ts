import { ApiError } from "@/lib/api/api-error";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

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
      setError(field, {
        type: "server",
        message,
      });
    }
  });

  return true;
}
