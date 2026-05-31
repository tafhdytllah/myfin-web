import { FormError } from "@/components/form/form-error";
import { FormSection } from "@/components/form/form-section";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { PasswordField } from "@/components/inputs/password-field";
import { SectionCard } from "@/components/section-card";
import { FieldDescription } from "@/components/ui/field";
import { useChangePassword } from "@/features/profile/hooks/use-profile-mutations";
import { ChangePasswordSchema, createChangePasswordSchema } from "@/features/profile/schemas/profile.schema";
import { ApiError } from "@/lib/api/api-error";
import { applyApiFieldErrors } from "@/lib/errors/apply-field-errors";
import { useTranslations } from "@/lib/i18n/use-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export function ChangePasswordSection() {
  const { t } = useTranslations();

  const [formError, setFormError] = useState<string>();

  const changePasswordMutation = useChangePassword();

  const changePasswordSchema = useMemo(
    () => createChangePasswordSchema(t),
    [t]
  );

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit(values: ChangePasswordSchema) {
    setFormError(undefined);

    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          form.reset();
        },
        onError: (error) => {
          if (ApiError.isApiError(error)) {
            setFormError(error.message);
          }

          applyApiFieldErrors(error, ["currentPassword", "newPassword"], form.setError);
        },
      },
    );
  }

  return (
    <SectionCard
      title={t("profile.changePassword")}
      description={t("profile.changePasswordDescription")}
    >
      <FormSection layout="grid" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <PasswordField
          label={t("profile.currentPassword")}
          id="current-password"
          error={form.formState.errors.currentPassword?.message}
          placeholder={t("auth.passwordPlaceholder")}
          toggleLabel={t("profile.togglePasswordVisibility")}
          {...form.register("currentPassword")}
        />

        <PasswordField
          label={t("profile.newPassword")}
          id="new-password"
          error={form.formState.errors.newPassword?.message}
          placeholder={t("auth.passwordPlaceholder")}
          toggleLabel={t("profile.togglePasswordVisibility")}
          description={<FieldDescription>{t("profile.passwordHint")}</FieldDescription>}
          {...form.register("newPassword")}
        />

        <PasswordField
          label={t("profile.confirmNewPassword")}
          id="confirm-password"
          error={form.formState.errors.confirmNewPassword?.message}
          placeholder={t("auth.confirmPasswordPlaceholder")}
          toggleLabel={t("profile.togglePasswordVisibility")}
          {...form.register("confirmNewPassword")}
        />

        <FormSubmitButton
          idleLabel={t("profile.updatePassword")}
          pendingLabel={t("profile.savingPassword")}
          pending={changePasswordMutation.isPending}
          disabled={!form.formState.isDirty}
          className="h-11 w-full rounded-2xl px-5 text-sm font-semibold sm:w-fit"
        />
      </FormSection>
    </SectionCard>
  );
}
