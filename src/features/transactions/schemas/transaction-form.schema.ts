import { z } from "zod";

import { createValidationMessages, type TranslateFn } from "@/lib/validation/messages";

export function createTransactionFormSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z.object({
    type: z.enum(["INCOME", "EXPENSE"], {
      error: () => validation.required(t("common.type")),
    }),
    accountId: z
      .string()
      .trim()
      .min(1, validation.required(t("common.account"))),
    categoryId: z
      .string()
      .trim()
      .min(1, validation.required(t("common.category"))),
    amount: z
      .string()
      .trim()
      .min(1, validation.required(t("common.amount")))
      .refine(
        (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
        validation.positiveNumber(t("common.amount")),
      ),
    description: z.string().trim().optional(),
  });
}

export type TransactionFormValues = z.infer<
  ReturnType<typeof createTransactionFormSchema>
>;
