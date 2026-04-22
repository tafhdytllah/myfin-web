import { z } from "zod";

export const profileInfoSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  email: z.string().trim().email("Please enter a valid email address."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, "Current password is required."),
    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters."),
    confirmNewPassword: z
      .string()
      .trim()
      .min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match.",
  });

export type ProfileInfoSchema = z.infer<typeof profileInfoSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
