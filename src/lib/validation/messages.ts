export type TranslateFn = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export function createValidationMessages(t: TranslateFn) {
  return {
    required: (field: string) => t("validation.required", { field }),
    minCharacters: (field: string, count: number) =>
      t("validation.minCharacters", { field, count }),
    validEmail: () => t("validation.validEmail"),
    mustMatch: (field: string) => t("validation.mustMatch", { field }),
    positiveNumber: (field: string) => t("validation.positiveNumber", { field }),
    nonNegativeNumber: (field: string) =>
      t("validation.nonNegativeNumber", { field }),
  };
}
