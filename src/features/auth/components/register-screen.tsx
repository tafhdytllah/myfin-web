"use client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthFormCard } from "@/components/shared/auth-form-card";
import { AuthFormFooterLink } from "@/components/shared/auth-form-footer-link";
import { FormFieldItem } from "@/components/shared/form-field-item";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/features/auth/hooks/use-auth-actions";
import {
  createRegisterSchema,
  type RegisterSchema,
} from "@/features/auth/schemas/register-schema";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
import { ApiError } from "@/lib/api/types";
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
      if (ApiError.isApiError(error)) {
        applyApiFieldErrors(error, ["username", "email", "password"], setError);
        setFormError(error.message);
        return;
      }

      setFormError(t("auth.registerError"));
    }
  };

  return (
    <AuthFormCard
      eyebrow={t("auth.getStarted")}
      title={t("auth.registerTitle")}
      description={t("auth.registerDescription")}
      footer={
        <AuthFormFooterLink
          prompt={t("auth.alreadyHaveAccount")}
          href={routes.login}
          label={t("auth.signInLink")}
        />
      }
    >
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
            <FormFieldItem
              key={field.name}
              label={field.label}
              errors={[errors[field.name as "username" | "email"]]}
            >
              <Input
                {...register(field.name as "username" | "email")}
                className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
                placeholder={field.placeholder}
              />
            </FormFieldItem>
          ))}

          <FormFieldItem
            label={t("auth.password")}
            errors={[errors.password]}
            description={<FieldDescription>{t("profile.passwordHint")}</FieldDescription>}
          >
            <PasswordInput
              {...register("password")}
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
              placeholder={t("auth.passwordPlaceholder")}
              toggleLabel={t("auth.togglePasswordVisibility")}
            />
          </FormFieldItem>

          <FormFieldItem
            label={t("auth.confirmPassword")}
            errors={[errors.confirmPassword]}
          >
            <PasswordInput
              {...register("confirmPassword")}
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
              placeholder={t("auth.confirmPasswordPlaceholder")}
              toggleLabel={t("auth.togglePasswordVisibility")}
            />
          </FormFieldItem>

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
    </AuthFormCard>
  );
}
