export type FieldErrors = Record<string, string | string[]>;

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: FieldErrors;

  constructor({
    message,
    status,
    code,
    details,
  }: {
    message: string;
    status: number;
    code?: string;
    details?: FieldErrors;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
