import { z } from "zod";
import { createValidationMessages, type TranslateFn } from "@/lib/validation/messages";

export function createLoginFormSchema(t: TranslateFn) {
  const validation = createValidationMessages(t);

  return z.object({
    username: z.string().trim().min(1, validation.required(t("auth.username"))),
    password: z.string().trim().min(1, validation.required(t("auth.password"))),
  });
}

export type LoginFormSchema = z.infer<ReturnType<typeof createLoginFormSchema>>;
