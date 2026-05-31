"use client";

import { usePageTrail } from "@/components/layout/page-trail-context";
import { RetryCard } from "@/components/retry-card";
import { SectionCardSkeletonGrid } from "@/components/section-card-skeleton-grid";
import { ChangePasswordSection } from "@/features/profile/components/change-password.section";
import { ProfileInfoSection } from "@/features/profile/components/profile-info.section";
import { useCurrentProfile } from "@/features/profile/hooks/use-profile-queries";
import { useTranslations } from "@/lib/i18n/use-translations";

export function ProfilePage() {
  const { t } = useTranslations();

  const profileQuery = useCurrentProfile();

  usePageTrail([]);
  
  if (profileQuery.isLoading) {
    return (
      <SectionCardSkeletonGrid
        count={2}
        gridClassName="gap-6 xl:grid-cols-2"
        skeletonCount={4}
        skeletonItemClassName="rounded bg-muted"
        skeletonClassName="space-y-4 [&>*:nth-child(1)]:h-4 [&>*:nth-child(1)]:w-32 [&>*:nth-child(2)]:h-11 [&>*:nth-child(3)]:h-4 [&>*:nth-child(3)]:w-28 [&>*:nth-child(4)]:h-11"
      />
    );
  }

  if (profileQuery.isError) {
    return (
      <RetryCard
        title={t("profile.loadErrorTitle")}
        description={t("profile.loadErrorDescription")}
        retryLabel={t("profile.retry")}
        onRetry={() => profileQuery.refetch()}
      />
    );
  }

  if (!profileQuery.data) {
    return null;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ProfileInfoSection data={profileQuery.data} />
      <ChangePasswordSection />
    </div>
  );
}

