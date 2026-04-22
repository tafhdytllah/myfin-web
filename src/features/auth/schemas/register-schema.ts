import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
