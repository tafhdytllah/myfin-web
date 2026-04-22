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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Card className="rounded-[var(--radius-card)] border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="p-8 pb-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
          Welcome back
        </p>
        <CardTitle className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
          Sign in to MyFin
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-[var(--color-foreground-muted)]">
          Access your personal finance dashboard and continue tracking your money clearly.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-8">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormError message={formError} />

          <div>
            <Label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Username
            </Label>
            <Input
              {...register("username")}
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4"
              placeholder="demo"
            />
            {errors.username ? (
              <p className="mt-2 text-sm text-[var(--color-danger)]">
                {errors.username.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Password
            </Label>
            <Input
              {...register("password")}
              type="password"
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4"
              placeholder="••••••••"
            />
            {errors.password ? (
              <p className="mt-2 text-sm text-[var(--color-danger)]">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || loginMutation.isPending}
            className="h-12 w-full rounded-2xl bg-[var(--color-surface-sidebar)] font-medium text-white hover:bg-[var(--color-surface-sidebar)]/95"
          >
            {isSubmitting || loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--color-foreground-muted)]">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-[var(--color-primary-strong)]"
            href={routes.register}
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
