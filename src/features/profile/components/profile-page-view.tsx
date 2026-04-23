"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
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
  changePasswordSchema,
  ChangePasswordSchema,
  ProfileInfoSchema,
  profileInfoSchema,
} from "@/features/profile/schemas/profile-schema";
import {
  useChangePassword,
  useCurrentProfile,
  useUpdateProfile,
} from "@/features/profile/hooks/use-profile-queries";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

function getFieldError(error: unknown, field: string) {
  if (!(error instanceof ApiError)) {
    return undefined;
  }

  const detail = error.details?.[field];

  if (Array.isArray(detail)) {
    return detail[0];
  }

  return detail;
}

export function ProfilePageView() {
  const { t } = useTranslations();
  const setUser = useAuthStore((state) => state.setUser);
  const profileQuery = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const [profileFormError, setProfileFormError] = useState<string>();
  const [passwordFormError, setPasswordFormError] = useState<string>();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

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

  function togglePasswordVisibility(key: keyof typeof showPasswords) {
    setShowPasswords((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function handleProfileSubmit(values: ProfileInfoSchema) {
    setProfileFormError(undefined);

    updateProfileMutation.mutate(values, {
      onError: (error) => {
        const usernameError = getFieldError(error, "username");
        const emailError = getFieldError(error, "email");

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
          const currentPasswordError = getFieldError(error, "currentPassword");
          const newPasswordError = getFieldError(error, "newPassword");

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
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      {...passwordForm.register("currentPassword")}
                      placeholder={t("auth.passwordPlaceholder")}
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 size-9 rounded-xl"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      <span className="sr-only">
                        {t("profile.togglePasswordVisibility")}
                      </span>
                    </Button>
                  </div>
                  <FieldError errors={[passwordForm.formState.errors.currentPassword]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="new-password">{t("profile.newPassword")}</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.next ? "text" : "password"}
                      {...passwordForm.register("newPassword")}
                      placeholder={t("auth.passwordPlaceholder")}
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 size-9 rounded-xl"
                      onClick={() => togglePasswordVisibility("next")}
                    >
                      {showPasswords.next ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      <span className="sr-only">
                        {t("profile.togglePasswordVisibility")}
                      </span>
                    </Button>
                  </div>
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
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      {...passwordForm.register("confirmNewPassword")}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 size-9 rounded-xl"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      <span className="sr-only">
                        {t("profile.togglePasswordVisibility")}
                      </span>
                    </Button>
                  </div>
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
