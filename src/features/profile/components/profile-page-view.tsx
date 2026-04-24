"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ChangePasswordSection } from "@/features/profile/components/change-password-section";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileInfoSection } from "@/features/profile/components/profile-info-section";
import { RetryCard } from "@/components/shared/retry-card";
import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { usePageTrail } from "@/components/layout/page-trail-context";
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
          <ProfileInfoSection
            title={t("profile.profileInfo")}
            description={t("profile.profileInfoDescription")}
            submitLabel={t("profile.saveProfile")}
            pendingLabel={t("profile.savingProfile")}
            formError={profileFormError}
            pending={updateProfileMutation.isPending}
            form={profileForm}
            onSubmit={handleProfileSubmit}
            labels={{
              username: t("auth.username"),
              usernamePlaceholder: t("profile.usernamePlaceholder"),
              email: t("auth.email"),
              emailPlaceholder: t("profile.emailPlaceholder"),
            }}
          />

          <ChangePasswordSection
            title={t("profile.changePassword")}
            description={t("profile.changePasswordDescription")}
            submitLabel={t("profile.updatePassword")}
            pendingLabel={t("profile.savingPassword")}
            passwordHint={t("profile.passwordHint")}
            toggleLabel={t("profile.togglePasswordVisibility")}
            formError={passwordFormError}
            pending={changePasswordMutation.isPending}
            form={passwordForm}
            onSubmit={handlePasswordSubmit}
            labels={{
              currentPassword: t("profile.currentPassword"),
              newPassword: t("profile.newPassword"),
              confirmNewPassword: t("profile.confirmNewPassword"),
              passwordPlaceholder: t("auth.passwordPlaceholder"),
              confirmPasswordPlaceholder: t("auth.confirmPasswordPlaceholder"),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
