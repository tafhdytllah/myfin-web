import { z } from "zod";
import { createValidationMessages, type TranslateFn } from "@/lib/validation/messages";

export function createRegisterSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z
    .object({
      username: z
        .string()
        .trim()
        .min(3, validation.minCharacters(t("auth.username"), 3)),
      email: z.string().trim().email(validation.validEmail()),
      password: z
        .string()
        .trim()
        .min(8, validation.minCharacters(t("auth.password"), 8)),
      confirmPassword: z
        .string()
        .trim()
        .min(1, validation.required(t("auth.confirmPassword"))),
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: validation.mustMatch(t("auth.confirmPassword")),
      path: ["confirmPassword"],
    });
}

export type RegisterSchema = z.infer<ReturnType<typeof createRegisterSchema>>;
