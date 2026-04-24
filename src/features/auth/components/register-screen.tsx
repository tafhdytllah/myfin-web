"use client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthFormCard } from "@/components/shared/auth-form-card";
import { AuthFormFooterLink } from "@/components/shared/auth-form-footer-link";
import { FormError } from "@/components/shared/form-error";
import { FormLayout } from "@/components/shared/form-layout";
import { FormSubmitButton } from "@/components/shared/form-submit-button";
import { PasswordFieldItem } from "@/components/shared/password-field-item";
import { TextInputField } from "@/components/shared/text-input-field";
import { FieldDescription } from "@/components/ui/field";
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
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <TextInputField
          label={t("auth.username")}
          registration={register("username")}
          error={errors.username?.message}
          className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
          placeholder={t("auth.usernamePlaceholder")}
        />

        <TextInputField
          label={t("auth.email")}
          registration={register("email")}
          error={errors.email?.message}
          className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
          placeholder={t("auth.emailPlaceholder")}
        />

        <PasswordFieldItem
          label={t("auth.password")}
          registration={register("password")}
          error={errors.password?.message}
          className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
          placeholder={t("auth.passwordPlaceholder")}
          toggleLabel={t("auth.togglePasswordVisibility")}
          description={<FieldDescription>{t("profile.passwordHint")}</FieldDescription>}
        />

        <PasswordFieldItem
          label={t("auth.confirmPassword")}
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
          placeholder={t("auth.confirmPasswordPlaceholder")}
          toggleLabel={t("auth.togglePasswordVisibility")}
        />

        <FormSubmitButton
          idleLabel={t("auth.createAccount")}
          pendingLabel={t("auth.creatingAccount")}
          pending={isSubmitting || registerMutation.isPending}
          className="h-12 w-full rounded-2xl bg-[var(--color-surface-sidebar)] font-medium text-white hover:bg-[var(--color-surface-sidebar)]/95"
        />
      </FormLayout>
    </AuthFormCard>
  );
}
