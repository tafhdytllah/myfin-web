"use client";

import { AuthFormCard } from "@/components/shared/auth-form-card";
import { AuthFormFooterLink } from "@/components/shared/auth-form-footer-link";
import { FormError } from "@/components/shared/form/form-error";
import { FormSection } from "@/components/shared/form/form-section";
import { FormSubmitButton } from "@/components/shared/form/form-submit-button";
import { PasswordField } from "@/components/shared/inputs/password-field";
import { TextField } from "@/components/shared/inputs/text-field";
import { useLogin } from "@/features/auth/hooks/use-auth-actions";
import {
  createLoginSchema,
  type LoginSchema,
} from "@/features/auth/schemas/login-schema";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
import { ApiError } from "@/lib/api/types";
import { routes } from "@/lib/constants/routes";
import { useTranslations } from "@/lib/i18n/use-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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
    <AuthFormCard
      eyebrow={t("auth.welcomeBack")}
      title={t("auth.loginTitle")}
      description={t("auth.loginDescription")}
      footer={
        <AuthFormFooterLink
          prompt={t("auth.dontHaveAccount")}
          href={routes.register}
          label={t("auth.createOne")}
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
          error={errors.username?.message}
          {...register("username")}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
        />

        <PasswordField
          id="password"
          autoComplete="current-password"
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          toggleLabel={t("auth.togglePasswordVisibility")}
          error={errors.password?.message}
          {...register("password")}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
        />

        <FormSubmitButton
          idleLabel={t("auth.signIn")}
          pendingLabel={t("auth.signingIn")}
          pending={isSubmitting || loginMutation.isPending}
          className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        />
      </FormSection>
    </AuthFormCard>
  );
}
