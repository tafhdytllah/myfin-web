"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormError } from "@/components/shared/form-error";
import { useLogin } from "@/features/auth/hooks/use-auth-actions";
import { loginSchema, type LoginSchema } from "@/features/auth/schemas/login-schema";
import { ApiError } from "@/lib/api/types";
import { routes } from "@/lib/constants/routes";

export function LoginScreen() {
  const [formError, setFormError] = useState<string | undefined>();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setFormError(undefined);

    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details?.username) {
          setError("username", {
            message: Array.isArray(error.details.username)
              ? error.details.username[0]
              : error.details.username,
          });
        }

        if (error.details?.password) {
          setError("password", {
            message: Array.isArray(error.details.password)
              ? error.details.password[0]
              : error.details.password,
          });
        }

        setFormError(error.message);
        return;
      }

      setFormError("Unable to sign in right now. Please try again.");
    }
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
        <FormError message={formError} />

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
          disabled={isSubmitting || loginMutation.isPending}
          className="w-full rounded-2xl bg-[var(--color-surface-sidebar)] px-4 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting || loginMutation.isPending ? "Signing in..." : "Sign In"}
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
