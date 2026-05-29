import { FormError } from "@/components/form/form-error";
import { FormSection } from "@/components/form/form-section";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { PasswordField } from "@/components/inputs/password-field";
import { SectionCard } from "@/components/section-card";
import { FieldDescription } from "@/components/ui/field";
import { ChangePasswordSchema } from "@/features/profile/schemas/profile.schema";
import type { UseFormReturn } from "react-hook-form";

type ChangePasswordSectionProps = {
  title: string;
  description: string;
  submitLabel: string;
  pendingLabel: string;
  passwordHint: string;
  toggleLabel: string;
  formError?: string;
  pending: boolean;
  form: UseFormReturn<ChangePasswordSchema>;
  onSubmit: (values: ChangePasswordSchema) => void;
  labels: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    passwordPlaceholder: string;
    confirmPasswordPlaceholder: string;
  };
};

export function ChangePasswordSection({
  title,
  description,
  submitLabel,
  pendingLabel,
  passwordHint,
  toggleLabel,
  formError,
  pending,
  form,
  onSubmit,
  labels,
}: ChangePasswordSectionProps) {
  return (
    <SectionCard title={title} description={description}>
      <FormSection layout="grid" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <PasswordField
          label={labels.currentPassword}
          id="current-password"
          error={form.formState.errors.currentPassword?.message}
          placeholder={labels.passwordPlaceholder}
          toggleLabel={toggleLabel}
          {...form.register("currentPassword")}
        />

        <PasswordField
          label={labels.newPassword}
          id="new-password"
          error={form.formState.errors.newPassword?.message}
          placeholder={labels.passwordPlaceholder}
          toggleLabel={toggleLabel}
          description={<FieldDescription>{passwordHint}</FieldDescription>}
          {...form.register("newPassword")}
        />

        <PasswordField
          label={labels.confirmNewPassword}
          id="confirm-password"
          error={form.formState.errors.confirmNewPassword?.message}
          placeholder={labels.confirmPasswordPlaceholder}
          toggleLabel={toggleLabel}
          {...form.register("confirmNewPassword")}
        />

        <FormSubmitButton
          idleLabel={submitLabel}
          pendingLabel={pendingLabel}
          pending={pending}
          disabled={!form.formState.isDirty}
          className="h-11 w-full rounded-2xl px-5 text-sm font-semibold sm:w-fit"
        />
      </FormSection>
    </SectionCard>
  );
}
