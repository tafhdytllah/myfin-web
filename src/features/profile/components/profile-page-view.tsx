"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/shared/page-header";
import { PasswordInput } from "@/components/shared/password-input";
import { SectionCard } from "@/components/shared/section-card";
import { usePageTrail } from "@/components/layout/page-trail-context";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
import { getApiFieldError } from "@/lib/api/error-fields";
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
        const usernameError = getApiFieldError(error, "username");
        const emailError = getApiFieldError(error, "email");

        if (usernameError) {
          profileForm.setError("username", { message: usernameError });
        }

        if (emailError) {
          profileForm.setError("email", { message: emailError });
        }

        if (error instanceof ApiError) {
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
          const currentPasswordError = getApiFieldError(error, "currentPassword");
          const newPasswordError = getApiFieldError(error, "newPassword");

          if (currentPasswordError) {
            passwordForm.setError("currentPassword", {
              message: currentPasswordError,
            });
          }

          if (newPasswordError) {
            passwordForm.setError("newPassword", {
              message: newPasswordError,
            });
          }

          if (error instanceof ApiError) {
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
              <div className="space-y-4">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-11 rounded bg-muted" />
                <div className="h-4 w-28 rounded bg-muted" />
                <div className="h-11 rounded bg-muted" />
              </div>
            </SectionCard>
          ))}
        </div>
      ) : null}

      {profileQuery.isError ? (
        <SectionCard
          title={t("profile.loadErrorTitle")}
          description={t("profile.loadErrorDescription")}
        >
          <Button
            onClick={() => profileQuery.refetch()}
            variant="outline"
            className="rounded-2xl"
          >
            <RefreshCw className="size-4" />
            {t("profile.retry")}
          </Button>
        </SectionCard>
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

              <Field>
                <FieldLabel htmlFor="profile-username">{t("auth.username")}</FieldLabel>
                <FieldContent>
                  <Input
                    id="profile-username"
                    {...profileForm.register("username")}
                    placeholder={t("profile.usernamePlaceholder")}
                  />
                  <FieldError errors={[profileForm.formState.errors.username]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="profile-email">{t("auth.email")}</FieldLabel>
                <FieldContent>
                  <Input
                    id="profile-email"
                    type="email"
                    {...profileForm.register("email")}
                    placeholder={t("profile.emailPlaceholder")}
                  />
                  <FieldError errors={[profileForm.formState.errors.email]} />
                </FieldContent>
              </Field>

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

              <Field>
                <FieldLabel htmlFor="current-password">
                  {t("profile.currentPassword")}
                </FieldLabel>
                <FieldContent>
                  <PasswordInput
                    id="current-password"
                    {...passwordForm.register("currentPassword")}
                    placeholder={t("auth.passwordPlaceholder")}
                    toggleLabel={t("profile.togglePasswordVisibility")}
                  />
                  <FieldError errors={[passwordForm.formState.errors.currentPassword]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="new-password">{t("profile.newPassword")}</FieldLabel>
                <FieldContent>
                  <PasswordInput
                    id="new-password"
                    {...passwordForm.register("newPassword")}
                    placeholder={t("auth.passwordPlaceholder")}
                    toggleLabel={t("profile.togglePasswordVisibility")}
                  />
                  {passwordForm.formState.errors.newPassword ? (
                    <FieldError errors={[passwordForm.formState.errors.newPassword]} />
                  ) : (
                    <FieldDescription>{t("profile.passwordHint")}</FieldDescription>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  {t("profile.confirmNewPassword")}
                </FieldLabel>
                <FieldContent>
                  <PasswordInput
                    id="confirm-password"
                    {...passwordForm.register("confirmNewPassword")}
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    toggleLabel={t("profile.togglePasswordVisibility")}
                  />
                  <FieldError errors={[passwordForm.formState.errors.confirmNewPassword]} />
                </FieldContent>
              </Field>

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
