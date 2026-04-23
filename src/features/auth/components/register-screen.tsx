"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/features/auth/hooks/use-auth-actions";
import {
  createRegisterSchema,
  type RegisterSchema,
} from "@/features/auth/schemas/register-schema";
import { isApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { routes } from "@/lib/constants/routes";

export function RegisterScreen() {
  const [formError, setFormError] = useState<string | undefined>();
  const { t } = useTranslations();
  const schema = useMemo(() => createRegisterSchema(t), [t]);
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(schema),
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
      if (isApiError(error)) {
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

      setFormError(t("auth.registerError"));
    }
  };

  return (
    <Card className="rounded-[var(--radius-card)] border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="p-8 pb-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
          {t("auth.getStarted")}
        </p>
        <CardTitle className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
          {t("auth.registerTitle")}
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-[var(--color-foreground-muted)]">
          {t("auth.registerDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-8">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FieldError>{formError}</FieldError>

          {[
            {
              name: "username",
              label: t("auth.username"),
              placeholder: t("auth.usernamePlaceholder"),
            },
            {
              name: "email",
              label: t("auth.email"),
              placeholder: t("auth.emailPlaceholder"),
            },
          ].map((field) => (
            <Field key={field.name}>
              <FieldLabel>{field.label}</FieldLabel>
              <FieldContent>
                <Input
                  {...register(field.name as "username" | "email")}
                  className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
                  placeholder={field.placeholder}
                />
                <FieldError errors={[errors[field.name as "username" | "email"]]} />
              </FieldContent>
            </Field>
          ))}

          <Field>
            <FieldLabel>{t("auth.password")}</FieldLabel>
            <FieldContent>
              <PasswordInput
                {...register("password")}
                className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
                placeholder={t("auth.passwordPlaceholder")}
                toggleLabel={t("auth.togglePasswordVisibility")}
              />
              {errors.password ? (
                <FieldError errors={[errors.password]} />
              ) : (
                <FieldDescription>{t("profile.passwordHint")}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("auth.confirmPassword")}</FieldLabel>
            <FieldContent>
              <PasswordInput
                {...register("confirmPassword")}
                className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
                placeholder={t("auth.confirmPasswordPlaceholder")}
                toggleLabel={t("auth.togglePasswordVisibility")}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </FieldContent>
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
            className="h-12 w-full rounded-2xl bg-[var(--color-surface-sidebar)] font-medium text-white hover:bg-[var(--color-surface-sidebar)]/95"
          >
            {isSubmitting || registerMutation.isPending
              ? t("auth.creatingAccount")
              : t("auth.createAccount")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-foreground-muted)] sm:text-left">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link
            className="font-semibold text-[var(--color-primary-strong)]"
            href={routes.login}
          >
            {t("auth.signInLink")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
