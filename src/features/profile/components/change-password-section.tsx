import { FormError } from "@/components/shared/form-error";
import { FormLayout } from "@/components/shared/form-layout";
import { FormSubmitButton } from "@/components/shared/form-submit-button";
import { PasswordFieldItem } from "@/components/shared/password-field-item";
import { SectionCard } from "@/components/shared/section-card";
import { ChangePasswordSchema } from "@/features/profile/schemas/profile-schema";
import type { UseFormReturn } from "react-hook-form";
import { FieldDescription } from "@/components/ui/field";

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
      <FormLayout layout="grid" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <PasswordFieldItem
          label={labels.currentPassword}
          id="current-password"
          registration={form.register("currentPassword")}
          error={form.formState.errors.currentPassword?.message}
          placeholder={labels.passwordPlaceholder}
          toggleLabel={toggleLabel}
        />

        <PasswordFieldItem
          label={labels.newPassword}
          id="new-password"
          registration={form.register("newPassword")}
          error={form.formState.errors.newPassword?.message}
          placeholder={labels.passwordPlaceholder}
          toggleLabel={toggleLabel}
          description={<FieldDescription>{passwordHint}</FieldDescription>}
        />

        <PasswordFieldItem
          label={labels.confirmNewPassword}
          id="confirm-password"
          registration={form.register("confirmNewPassword")}
          error={form.formState.errors.confirmNewPassword?.message}
          placeholder={labels.confirmPasswordPlaceholder}
          toggleLabel={toggleLabel}
        />

        <FormSubmitButton
          idleLabel={submitLabel}
          pendingLabel={pendingLabel}
          pending={pending}
          disabled={!form.formState.isDirty}
          className="h-11 w-full rounded-2xl px-5 text-sm font-semibold sm:w-fit"
        />
      </FormLayout>
    </SectionCard>
  );
}
