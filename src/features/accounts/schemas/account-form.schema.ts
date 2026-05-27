import { z } from "zod";

import { TranslateFn } from "@/lib/i18n/types";
import { createValidationMessages } from "@/lib/validation/messages";

export function createAccountFormSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z.object({
    name: z
      .string().trim().min(1, validation.required(t("accounts.accountName"))),
    openingBalance: z
      .string().trim().min(1, validation.required(t("accounts.openingBalance")))
      .refine(
        (value) => !Number.isNaN(Number(value)) && Number(value) >= 0,
        validation.nonNegativeNumber(t("accounts.openingBalance")),
      ),
  });
}

export function updateAccountFormSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z.object({
    name: z
      .string().trim().min(1, validation.required(t("accounts.accountName"))),
  });
}

export type CreateAccountFormValues = z.input<
  ReturnType<typeof createAccountFormSchema>
>;
export type UpdateAccountFormValues = z.infer<
  ReturnType<typeof updateAccountFormSchema>
>;
