export type FieldErrors = Record<string, string | string[]>;

export type ApiError = {
  name: "ApiError";
  message: string;
  status: number;
  code?: string;
  details?: FieldErrors;
};

type CreateApiErrorParams = {
  message: string;
  status: number;
  code?: string;
  details?: FieldErrors;
};

export function createApiError({
  message,
  status,
  code,
  details,
}: CreateApiErrorParams): ApiError {
  return {
    name: "ApiError",
    message,
    status,
    code,
    details,
  };
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as Partial<ApiError>;

  return (
    candidate.name === "ApiError" &&
    typeof candidate.message === "string" &&
    typeof candidate.status === "number"
  );
}
