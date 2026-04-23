export type FieldErrors = Record<string, string | string[]>;

export type ApiErrorParams = {
  message: string;
  status: number;
  code?: string;
  details?: FieldErrors;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: FieldErrors;

  constructor({ message, status, code, details }: ApiErrorParams) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  getFieldError(field: string) {
    const detail = this.details?.[field];

    if (Array.isArray(detail)) {
      return detail[0];
    }

    return detail;
  }
}
