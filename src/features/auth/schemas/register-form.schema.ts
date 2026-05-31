import { z } from "zod";
import { createValidationMessages } from "@/lib/validation/messages";
import { TranslateFn } from "@/lib/i18n/types";

export function createRegisterFormSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z
    .object({
      username: z
        .string().trim().min(3, validation.minCharacters(t("auth.username"), 3)),
      email: z
        .email(validation.validEmail()).trim(),
      password: z
        .string().trim().min(8, validation.minCharacters(t("auth.password"), 8)).max(20, validation.maxCharacters(t("auth.password"), 20)),
      confirmPassword: z
        .string().trim().min(1, validation.required(t("auth.confirmPassword"))),
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: validation.mustMatch(t("auth.confirmPassword")),
      path: ["confirmPassword"],
    });
}

export type RegisterFormSchema = z.infer<ReturnType<typeof createRegisterFormSchema>>;
