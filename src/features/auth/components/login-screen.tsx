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
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <TextInputField
          label={t("auth.username")}
          registration={register("username")}
          error={errors.username?.message}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
          placeholder={t("auth.usernamePlaceholder")}
        />

        <PasswordFieldItem
          label={t("auth.password")}
          registration={register("password")}
          error={errors.password?.message}
          className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
          placeholder={t("auth.passwordPlaceholder")}
          toggleLabel={t("auth.togglePasswordVisibility")}
        />

        <FormSubmitButton
          idleLabel={t("auth.signIn")}
          pendingLabel={t("auth.signingIn")}
          pending={isSubmitting || loginMutation.isPending}
          className="h-12 w-full rounded-2xl bg-(--color-surface-sidebar) font-medium text-white hover:bg-surface-sidebar/95"
        />
      </FormLayout>
    </AuthFormCard>
  );
}
