import { z } from "zod";
import { createValidationMessages, type TranslateFn } from "@/lib/validation/messages";

export function createProfileInfoSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z.object({
    username: z.string().trim().min(1, validation.required(t("auth.username"))),
    email: z.string().trim().email(validation.validEmail()),
  });
}

export function createChangePasswordSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z
    .object({
      currentPassword: z
        .string()
        .trim()
        .min(1, validation.required(t("profile.currentPassword"))),
      newPassword: z
        .string()
        .trim()
        .min(8, validation.minCharacters(t("profile.newPassword"), 8)),
      confirmNewPassword: z
        .string()
        .trim()
        .min(1, validation.required(t("profile.confirmNewPassword"))),
    })
    .refine((values) => values.newPassword === values.confirmNewPassword, {
      path: ["confirmNewPassword"],
      message: validation.mustMatch(t("profile.confirmNewPassword")),
    });
}

export type ProfileInfoSchema = z.infer<ReturnType<typeof createProfileInfoSchema>>;
export type ChangePasswordSchema = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
