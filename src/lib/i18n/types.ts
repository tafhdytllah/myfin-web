export type TranslationValues = Record<string, string | number>;

export type TranslateFn = (
  key: string,
  values?: TranslationValues,
) => string;