export type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: ApiMeta;
  errors?: ApiErrorBody;
};

export type ApiMeta = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: FieldErrors;
};

export type FieldErrors = Record<string, string | string[]>;