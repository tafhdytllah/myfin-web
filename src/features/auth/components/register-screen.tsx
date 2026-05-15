"use client";

import { AuthFormCard } from "@/components/shared/auth-form-card";
import { AuthFormFooterLink } from "@/components/shared/auth-form-footer-link";
import { FormError } from "@/components/shared/form/form-error";
import { FormSection } from "@/components/shared/form/form-section";
import { FormSubmitButton } from "@/components/shared/form/form-submit-button";
import { PasswordField } from "@/components/shared/inputs/password-field";
import { TextField } from "@/components/shared/inputs/text-field";
import { FieldDescription } from "@/components/ui/field";
import { useRegister } from "@/features/auth/hooks/use-auth-actions";
import {
  createRegisterSchema,
  type RegisterSchema,
} from "@/features/auth/schemas/register-schema";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
import { ApiError } from "@/lib/api/types";
import { routes } from "@/lib/constants/routes";
import { useTranslations } from "@/lib/i18n/use-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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
      <FormSection onSubmit={handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <TextField
          id="username"
          type="text"
          autoComplete="username"
          label={t("auth.username")}
          placeholder={t("auth.usernamePlaceholder")}
          {...register("username")}
          error={errors.username?.message}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
        />

        <TextField
          id="email"
          type="email"
          autoComplete="email"
          label={t("auth.email")}
          placeholder={t("auth.emailPlaceholder")}
          error={errors.email?.message}
          {...register("email")}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
        />

        <PasswordField
          id="password"
          autoComplete="new-password"
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          toggleLabel={t("auth.togglePasswordVisibility")}
          description={<FieldDescription>{t("profile.passwordHint")}</FieldDescription>}
          error={errors.password?.message}
          {...register("password")}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
        />

        <PasswordField
          id="confirmPassword"
          autoComplete="new-password"
          label={t("auth.confirmPassword")}
          placeholder={t("auth.confirmPasswordPlaceholder")}
          toggleLabel={t("auth.togglePasswordVisibility")}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
        />

        <FormSubmitButton
          idleLabel={t("auth.createAccount")}
          pendingLabel={t("auth.creatingAccount")}
          pending={isSubmitting || registerMutation.isPending}
          className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        />
      </FormSection>
    </AuthFormCard>
  );
}
