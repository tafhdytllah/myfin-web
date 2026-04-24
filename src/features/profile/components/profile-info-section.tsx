import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormFieldItem } from "@/components/shared/form-field-item";
import { SectionCard } from "@/components/shared/section-card";
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
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldError>{formError}</FieldError>

        <FormFieldItem
          label={labels.username}
          htmlFor="profile-username"
          errors={[form.formState.errors.username]}
        >
          <Input
            id="profile-username"
            {...form.register("username")}
            placeholder={labels.usernamePlaceholder}
          />
        </FormFieldItem>

        <FormFieldItem
          label={labels.email}
          htmlFor="profile-email"
          errors={[form.formState.errors.email]}
        >
          <Input
            id="profile-email"
            type="email"
            {...form.register("email")}
            placeholder={labels.emailPlaceholder}
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
