"use client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthFormCard } from "@/components/shared/auth-form-card";
import { AuthFormFooterLink } from "@/components/shared/auth-form-footer-link";
import { FormFieldItem } from "@/components/shared/form-field-item";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
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
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FieldError>{formError}</FieldError>

          <FormFieldItem label={t("auth.username")} errors={[errors.username]}>
            <Input
              {...register("username")}
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
              placeholder={t("auth.usernamePlaceholder")}
            />
          </FormFieldItem>

          <FormFieldItem label={t("auth.password")} errors={[errors.password]}>
            <PasswordInput
              {...register("password")}
              className="h-12 rounded-2xl border-[var(--color-border-strong)] bg-white px-4 dark:bg-transparent"
              placeholder={t("auth.passwordPlaceholder")}
              toggleLabel={t("auth.togglePasswordVisibility")}
            />
          </FormFieldItem>

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
    </AuthFormCard>
  );
}
