import { FormError } from "@/components/shared/form/form-error";
import { FormSection } from "@/components/shared/form/form-section";
import { FormSubmitButton } from "@/components/shared/form/form-submit-button";
import { TextField } from "@/components/shared/inputs/text-field";
import { SectionCard } from "@/components/shared/section-card";
import { ProfileInfoSchema } from "@/features/profile/schemas/profile.schema";
import type { UseFormReturn } from "react-hook-form";

type ProfileInfoSectionProps = {
  title: string;
  description: string;
  submitLabel: string;
  pendingLabel: string;
  formError?: string;
  pending: boolean;
  form: UseFormReturn<ProfileInfoSchema>;
  onSubmit: (values: ProfileInfoSchema) => void;
  labels: {
    username: string;
    usernamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
  };
};

export function ProfileInfoSection({
  title,
  description,
  submitLabel,
  pendingLabel,
  formError,
  pending,
  form,
  onSubmit,
  labels,
}: ProfileInfoSectionProps) {
  return (
    <SectionCard title={title} description={description}>
      <FormSection layout="grid" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <TextField
          label={labels.username}
          id="profile-username"
          error={form.formState.errors.username?.message}
          placeholder={labels.usernamePlaceholder}
          {...form.register("username")}
        />

        <TextField
          label={labels.email}
          id="profile-email"
          type="email"
          error={form.formState.errors.email?.message}
          placeholder={labels.emailPlaceholder}
          {...form.register("email")}
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
