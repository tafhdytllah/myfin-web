export type BackendErrorPayload = {
  errors?: {
    code?: string;
    message?: string;
    details?: Record<string, string | string[]>;
  };
};