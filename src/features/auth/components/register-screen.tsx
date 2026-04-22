"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { routes } from "@/lib/constants/routes";
import {
  registerSchema,
  type RegisterSchema,
} from "@/features/auth/schemas/register-schema";

export function RegisterScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    await Promise.resolve();
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
        Get started
      </p>
      <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
        Set up your workspace so you can track income, expenses, and balances in one place.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {[
          { name: "username", label: "Username", placeholder: "bonney" },
          { name: "email", label: "Email", placeholder: "bonney@example.com" },
        ].map((field) => (
          <div key={field.name}>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              {field.label}
            </label>
            <input
              {...register(field.name as "username" | "email")}
              className="w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-strong)]"
              placeholder={field.placeholder}
            />
            {errors[field.name as "username" | "email"] ? (
              <p className="mt-2 text-sm text-[var(--color-danger)]">
                {errors[field.name as "username" | "email"]?.message}
              </p>
            ) : null}
          </div>
        ))}

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            className="w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-strong)]"
            placeholder="At least 8 characters"
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-[var(--color-danger)]">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Confirm password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            className="w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-strong)]"
            placeholder="Repeat your password"
          />
          {errors.confirmPassword ? (
            <p className="mt-2 text-sm text-[var(--color-danger)]">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--color-surface-sidebar)] px-4 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--color-foreground-muted)]">
        Already have an account?{" "}
        <Link className="font-semibold text-[var(--color-primary-strong)]" href={routes.login}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
