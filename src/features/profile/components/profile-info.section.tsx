import { FormError } from "@/components/form/form-error";
import { FormSection } from "@/components/form/form-section";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { TextField } from "@/components/inputs/text-field";
import { SectionCard } from "@/components/section-card";
import { User } from "@/features/auth/types/user.types";
import { useUpdateProfile } from "@/features/profile/hooks/use-profile-mutations";
import { createProfileInfoSchema, ProfileInfoSchema } from "@/features/profile/schemas/profile.schema";
import { ApiError } from "@/lib/api/api-error";
import { applyApiFieldErrors } from "@/lib/errors/apply-field-errors";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type ProfileInfoSectionProps = {
  data: User;
}

export function ProfileInfoSection({ data }: ProfileInfoSectionProps) {

  const { t } = useTranslations();

  const setUser = useAuthStore((state) => state.setUser);

  const [formError, setFormError] = useState<string | undefined>();

  const updateProfileMutation = useUpdateProfile();

  const profileInfoSchema = useMemo(
    () => createProfileInfoSchema(t),
    [t]
  );

  const form = useForm<ProfileInfoSchema>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    setUser(data);

    form.reset({
      username: data.username,
      email: data.email,
    });
  }, [form, data, setUser]);


  function onSubmit(values: ProfileInfoSchema) {
    setFormError(undefined);

    updateProfileMutation.mutate(values, {
      onError: (error) => {
        if (ApiError.isApiError(error)) {
          setFormError(error.message);
        }

        applyApiFieldErrors(error, ["username", "email"], form.setError);
      },
    });
  }

  return (
    <SectionCard
      title={t("profile.profileInfo")}
      description={t("profile.profileInfoDescription")}
    >
      <FormSection layout="grid" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError message={formError} />

        <TextField
          label={t("auth.username")}
          id="profile-username"
          error={form.formState.errors.username?.message}
          placeholder={t("profile.usernamePlaceholder")}
          {...form.register("username")}
        />

        <TextField
          label={t("auth.email")}
          id="profile-email"
          type="email"
          error={form.formState.errors.email?.message}
          placeholder={t("profile.emailPlaceholder")}
          {...form.register("email")}
        />

        <FormSubmitButton
          idleLabel={t("profile.saveProfile")}
          pendingLabel={t("profile.savingProfile")}
          pending={updateProfileMutation.isPending}
          disabled={!form.formState.isDirty}
          className="h-11 w-full rounded-2xl px-5 text-sm font-semibold sm:w-fit"
        />
      </FormSection>
    </SectionCard>
  );
}
