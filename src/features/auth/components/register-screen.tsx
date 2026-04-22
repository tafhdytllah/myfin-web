"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormError } from "@/components/shared/form-error";
import { useRegister } from "@/features/auth/hooks/use-auth-actions";
import {
  registerSchema,
  type RegisterSchema,
} from "@/features/auth/schemas/register-schema";
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

export function RegisterScreen() {
  const [formError, setFormError] = useState<string | undefined>();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    setError,
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

  const onSubmit = async (values: RegisterSchema) => {
    setFormError(undefined);

    try {
      await registerMutation.mutateAsync({
        username: values.username,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details?.username) {
          setError("username", {
            message: Array.isArray(error.details.username)
              ? error.details.username[0]
              : error.details.username,
          });
        }

        if (error.details?.email) {
          setError("email", {
            message: Array.isArray(error.details.email)
              ? error.details.email[0]
              : error.details.email,
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

      setFormError("Unable to create your account right now. Please try again.");
    }
  };

  return (
    <Card className="rounded-[var(--radius-card)] border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="p-8 pb-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
          Get started
        </p>
        <CardTitle className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
          Create your account
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-[var(--color-foreground-muted)]">
          Set up your workspace so you can track income, expenses, and balances in one place.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-8">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormError message={formError} />

          {[
            { name: "username", label: "Username", placeholder: "bonney" },
            { name: "email", label: "Email", placeholder: "bonney@example.com" },
          ].map((field) => (
            <div key={field.name}>
              <Label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                {field.label}
              </Label>
              <Input
                {...register(field.name as "username" | "email")}
                className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4"
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
            <Label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Password
            </Label>
            <Input
              {...register("password")}
              type="password"
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4"
              placeholder="At least 8 characters"
            />
            {errors.password ? (
              <p className="mt-2 text-sm text-[var(--color-danger)]">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Confirm password
            </Label>
            <Input
              {...register("confirmPassword")}
              type="password"
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4"
              placeholder="Repeat your password"
            />
            {errors.confirmPassword ? (
              <p className="mt-2 text-sm text-[var(--color-danger)]">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
            className="h-12 w-full rounded-2xl bg-[var(--color-surface-sidebar)] font-medium text-white hover:bg-[var(--color-surface-sidebar)]/95"
          >
            {isSubmitting || registerMutation.isPending
              ? "Creating account..."
              : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--color-foreground-muted)]">
          Already have an account?{" "}
          <Link
            className="font-semibold text-[var(--color-primary-strong)]"
            href={routes.login}
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
