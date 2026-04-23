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
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/hooks/use-auth-actions";
import {
  createLoginSchema,
  type LoginSchema,
} from "@/features/auth/schemas/login-schema";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { routes } from "@/lib/constants/routes";

export function LoginScreen() {
  const [formError, setFormError] = useState<string | undefined>();
  const { t } = useTranslations();
  const schema = useMemo(() => createLoginSchema(t), [t]);
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
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
      if (ApiError.isApiError(error)) {
        applyApiFieldErrors(error, ["username", "password"], setError);
        setFormError(error.message);
        return;
      }

      setFormError(t("auth.signInError"));
    }
  };

  return (
    <Card className="rounded-[var(--radius-card)] border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="p-8 pb-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
          {t("auth.welcomeBack")}
        </p>
        <CardTitle className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
          {t("auth.loginTitle")}
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-[var(--color-foreground-muted)]">
          {t("auth.loginDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-8">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FieldError>{formError}</FieldError>

          <Field>
            <FieldLabel>{t("auth.username")}</FieldLabel>
            <FieldContent>
              <Input
                {...register("username")}
                className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
                placeholder={t("auth.usernamePlaceholder")}
              />
              <FieldError errors={[errors.username]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("auth.password")}</FieldLabel>
            <FieldContent>
              <PasswordInput
                {...register("password")}
                className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
                placeholder={t("auth.passwordPlaceholder")}
                toggleLabel={t("auth.togglePasswordVisibility")}
              />
              <FieldError errors={[errors.password]} />
            </FieldContent>
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting || loginMutation.isPending}
            className="h-12 w-full rounded-2xl bg-[var(--color-surface-sidebar)] font-medium text-white hover:bg-[var(--color-surface-sidebar)]/95"
          >
            {isSubmitting || loginMutation.isPending
              ? t("auth.signingIn")
              : t("auth.signIn")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-foreground-muted)] sm:text-left">
          {t("auth.dontHaveAccount")}{" "}
          <Link
            className="font-semibold text-[var(--color-primary-strong)]"
            href={routes.register}
          >
            {t("auth.createOne")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
