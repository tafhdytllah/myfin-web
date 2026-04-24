import { Button } from "@/components/ui/button";
import { FieldDescription, FieldError } from "@/components/ui/field";
import { FormFieldItem } from "@/components/shared/form-field-item";
import { PasswordInput } from "@/components/shared/password-input";
import { SectionCard } from "@/components/shared/section-card";
import { ChangePasswordSchema } from "@/features/profile/schemas/profile-schema";
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
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldError>{formError}</FieldError>

        <FormFieldItem
          label={labels.currentPassword}
          htmlFor="current-password"
          errors={[form.formState.errors.currentPassword]}
        >
          <PasswordInput
            id="current-password"
            {...form.register("currentPassword")}
            placeholder={labels.passwordPlaceholder}
            toggleLabel={toggleLabel}
          />
        </FormFieldItem>

        <FormFieldItem
          label={labels.newPassword}
          htmlFor="new-password"
          errors={[form.formState.errors.newPassword]}
          description={<FieldDescription>{passwordHint}</FieldDescription>}
        >
          <PasswordInput
            id="new-password"
            {...form.register("newPassword")}
            placeholder={labels.passwordPlaceholder}
            toggleLabel={toggleLabel}
          />
        </FormFieldItem>

        <FormFieldItem
          label={labels.confirmNewPassword}
          htmlFor="confirm-password"
          errors={[form.formState.errors.confirmNewPassword]}
        >
          <PasswordInput
            id="confirm-password"
            {...form.register("confirmNewPassword")}
            placeholder={labels.confirmPasswordPlaceholder}
            toggleLabel={toggleLabel}
          />
        </FormFieldItem>

        <Button
          type="submit"
          disabled={pending || !form.formState.isDirty}
          className="h-11 w-full rounded-2xl px-5 text-sm font-semibold sm:w-fit"
        >
          {pending ? pendingLabel : submitLabel}
        </Button>
      </form>
    </SectionCard>
  );
}
