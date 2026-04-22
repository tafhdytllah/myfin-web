"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { routes } from "@/lib/constants/routes";
import { loginSchema, type LoginSchema } from "@/features/auth/schemas/login-schema";

export function LoginScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    await Promise.resolve();
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
        Welcome back
      </p>
      <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
        Sign in to MyFin
      </h1>
      <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
        Access your personal finance dashboard and continue tracking your money clearly.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Username
          </label>
          <input
            {...register("username")}
            className="w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-strong)]"
            placeholder="demo"
          />
          {errors.username ? (
            <p className="mt-2 text-sm text-[var(--color-danger)]">
              {errors.username.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            className="w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-strong)]"
            placeholder="••••••••"
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-[var(--color-danger)]">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--color-surface-sidebar)] px-4 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--color-foreground-muted)]">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-[var(--color-primary-strong)]" href={routes.register}>
          Create one
        </Link>
      </p>
    </div>
  );
}
