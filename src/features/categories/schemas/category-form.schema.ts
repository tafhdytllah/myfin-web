import { z } from "zod";

import { createValidationMessages, type TranslateFn } from "@/lib/validation/messages";

export function createCategoryFormSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, validation.required(t("categories.categoryName"))),
    type: z.enum(["INCOME", "EXPENSE"], {
      error: () => validation.required(t("common.type")),
    }),
  });
}

export type CategoryFormValues = z.infer<
  ReturnType<typeof createCategoryFormSchema>
>;
