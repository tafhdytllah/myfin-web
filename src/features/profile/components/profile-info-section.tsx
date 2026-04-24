import { FormError } from "@/components/shared/form-error";
import { FormLayout } from "@/components/shared/form-layout";
import { FormSubmitButton } from "@/components/shared/form-submit-button";
import { SectionCard } from "@/components/shared/section-card";
import { TextInputField } from "@/components/shared/text-input-field";
import { ProfileInfoSchema } from "@/features/profile/schemas/profile-schema";
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
      <FormLayout layout="grid" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <TextInputField
          label={labels.username}
          id="profile-username"
          registration={form.register("username")}
          error={form.formState.errors.username?.message}
          placeholder={labels.usernamePlaceholder}
        />

        <TextInputField
          label={labels.email}
          id="profile-email"
          type="email"
          registration={form.register("email")}
          error={form.formState.errors.email?.message}
          placeholder={labels.emailPlaceholder}
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
