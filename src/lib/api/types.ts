export type FieldErrors = Record<string, string | string[]>;

export type RequestConfig = RequestInit & {
  accessToken?: string | null;
};

export type TokenEnvelope = {
  data: {
    accessToken: string;
    expiresIn: number;
  };
};
