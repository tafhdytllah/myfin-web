import { TranslateFn } from "@/lib/i18n/types";
import { createValidationMessages } from "@/lib/validation/messages";
import { z } from "zod";

export function createProfileInfoSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z.object({
    username: z
      .string().trim().min(1, validation.required(t("auth.username"))),
    email: z
      .email(validation.validEmail()).trim(),
  });
}

export function createChangePasswordSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z
    .object({
      currentPassword: z
        .string().trim().min(1, validation.required(t("profile.currentPassword"))),
      newPassword: z
        .string().trim().min(6, validation.minCharacters(t("profile.newPassword"), 6)).max(20, validation.maxCharacters(t("profile.newPassword"), 20)),
      confirmNewPassword: z
        .string().trim().min(1, validation.required(t("profile.confirmNewPassword"))),
    })
    .refine((values) => values.newPassword === values.confirmNewPassword, {
      path: ["confirmNewPassword"],
      message: validation.mustMatch(t("profile.confirmNewPassword")),
    });
}

export type ProfileInfoSchema = z.infer<
  ReturnType<typeof createProfileInfoSchema>
>;
export type ChangePasswordSchema = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
