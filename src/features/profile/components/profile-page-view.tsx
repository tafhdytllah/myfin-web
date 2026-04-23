"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { PageHeader } from "@/components/shared/page-header";
import { PasswordInput } from "@/components/shared/password-input";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createChangePasswordSchema,
  createProfileInfoSchema,
  ChangePasswordSchema,
  ProfileInfoSchema,
} from "@/features/profile/schemas/profile-schema";
import {
  useChangePassword,
  useCurrentProfile,
  useUpdateProfile,
} from "@/features/profile/hooks/use-profile-queries";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export function ProfilePageView() {
  const { t } = useTranslations();
  const setUser = useAuthStore((state) => state.setUser);
  const profileQuery = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const [profileFormError, setProfileFormError] = useState<string>();
  const [passwordFormError, setPasswordFormError] = useState<string>();

  const profileInfoSchema = useMemo(() => createProfileInfoSchema(t), [t]);
  const changePasswordSchema = useMemo(() => createChangePasswordSchema(t), [t]);

  usePageTrail([]);

  const profileForm = useForm<ProfileInfoSchema>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    setUser(profileQuery.data);
    profileForm.reset({
      username: profileQuery.data.username,
      email: profileQuery.data.email,
    });
  }, [profileForm, profileQuery.data, setUser]);

  function handleProfileSubmit(values: ProfileInfoSchema) {
    setProfileFormError(undefined);

    updateProfileMutation.mutate(values, {
      onError: (error) => {
        applyApiFieldErrors(error, ["username", "email"], profileForm.setError);

        if (ApiError.isApiError(error)) {
          setProfileFormError(error.message);
        }
      },
    });
  }

  function handlePasswordSubmit(values: ChangePasswordSchema) {
    setPasswordFormError(undefined);

    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          passwordForm.reset();
        },
        onError: (error) => {
          applyApiFieldErrors(
            error,
            ["currentPassword", "newPassword"],
            passwordForm.setError,
          );

          if (ApiError.isApiError(error)) {
            setPasswordFormError(error.message);
          }
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("profile.title")} description={t("profile.description")} />

      {profileQuery.isLoading ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <SectionCard key={index} title=" ">
              <StackSkeleton
                count={4}
                itemClassName="rounded bg-muted"
                className="space-y-4 [&>*:nth-child(1)]:h-4 [&>*:nth-child(1)]:w-32 [&>*:nth-child(2)]:h-11 [&>*:nth-child(3)]:h-4 [&>*:nth-child(3)]:w-28 [&>*:nth-child(4)]:h-11"
              />
            </SectionCard>
          ))}
        </div>
      ) : null}

      {profileQuery.isError ? (
        <RetryCard
          title={t("profile.loadErrorTitle")}
          description={t("profile.loadErrorDescription")}
          retryLabel={t("profile.retry")}
          onRetry={() => profileQuery.refetch()}
        />
      ) : null}

      {!profileQuery.isLoading && !profileQuery.isError ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard
            title={t("profile.profileInfo")}
            description={t("profile.profileInfoDescription")}
          >
            <form
              className="grid gap-4"
              onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
            >
              <FieldError>{profileFormError}</FieldError>

              <FormFieldItem
                label={t("auth.username")}
                htmlFor="profile-username"
                errors={[profileForm.formState.errors.username]}
              >
                <Input
                  id="profile-username"
                  {...profileForm.register("username")}
                  placeholder={t("profile.usernamePlaceholder")}
                />
              </FormFieldItem>

              <FormFieldItem
                label={t("auth.email")}
                htmlFor="profile-email"
                errors={[profileForm.formState.errors.email]}
              >
                <Input
                  id="profile-email"
                  type="email"
                  {...profileForm.register("email")}
                  placeholder={t("profile.emailPlaceholder")}
                />
              </FormFieldItem>

              <Button
                type="submit"
                disabled={
                  updateProfileMutation.isPending || !profileForm.formState.isDirty
                }
                className="h-11 w-full rounded-2xl px-5 text-sm font-semibold sm:w-fit"
              >
                {updateProfileMutation.isPending
                  ? t("profile.savingProfile")
                  : t("profile.saveProfile")}
              </Button>
            </form>
          </SectionCard>

          <SectionCard
            title={t("profile.changePassword")}
            description={t("profile.changePasswordDescription")}
          >
            <form
              className="grid gap-4"
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            >
              <FieldError>{passwordFormError}</FieldError>

              <FormFieldItem
                label={t("profile.currentPassword")}
                htmlFor="current-password"
                errors={[passwordForm.formState.errors.currentPassword]}
              >
                <PasswordInput
                  id="current-password"
                  {...passwordForm.register("currentPassword")}
                  placeholder={t("auth.passwordPlaceholder")}
                  toggleLabel={t("profile.togglePasswordVisibility")}
                />
              </FormFieldItem>

              <FormFieldItem
                label={t("profile.newPassword")}
                htmlFor="new-password"
                errors={[passwordForm.formState.errors.newPassword]}
                description={<FieldDescription>{t("profile.passwordHint")}</FieldDescription>}
              >
                <PasswordInput
                  id="new-password"
                  {...passwordForm.register("newPassword")}
                  placeholder={t("auth.passwordPlaceholder")}
                  toggleLabel={t("profile.togglePasswordVisibility")}
                />
              </FormFieldItem>

              <FormFieldItem
                label={t("profile.confirmNewPassword")}
                htmlFor="confirm-password"
                errors={[passwordForm.formState.errors.confirmNewPassword]}
              >
                <PasswordInput
                  id="confirm-password"
                  {...passwordForm.register("confirmNewPassword")}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  toggleLabel={t("profile.togglePasswordVisibility")}
                />
              </FormFieldItem>

              <Button
                type="submit"
                disabled={
                  changePasswordMutation.isPending || !passwordForm.formState.isDirty
                }
                className="h-11 w-full rounded-2xl px-5 text-sm font-semibold sm:w-fit"
              >
                {changePasswordMutation.isPending
                  ? t("profile.savingPassword")
                  : t("profile.updatePassword")}
              </Button>
            </form>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
