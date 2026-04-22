"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/i18n/use-translations";

export function ProfilePageView() {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader title={t("profile.title")} description={t("profile.description")} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title={t("profile.profileInfo")}
          description={t("profile.profileInfoDescription")}
        >
          <div className="grid gap-4">
            {[t("auth.username"), t("auth.email")].map((item) => (
              <div key={item} className="space-y-2">
                <Label className="text-sm font-medium text-[var(--color-foreground)]">
                  {item}
                </Label>
                <Input
                  readOnly
                  value={`${item} field`}
                  className="h-11 rounded-2xl border-dashed border-[var(--color-border-strong)] text-[var(--color-foreground-muted)]"
                />
              </div>
            ))}
            <Button className="h-11 w-fit rounded-2xl bg-[var(--color-surface-sidebar)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-surface-sidebar)]/95">
              {t("profile.saveProfile")}
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title={t("profile.changePassword")}
          description={t("profile.changePasswordDescription")}
        >
          <div className="grid gap-4">
            {[
              t("profile.currentPassword"),
              t("profile.newPassword"),
              t("profile.confirmNewPassword"),
            ].map((item) => (
              <div key={item} className="space-y-2">
                <Label className="text-sm font-medium text-[var(--color-foreground)]">
                  {item}
                </Label>
                <Input
                  readOnly
                  value={t("profile.passwordField")}
                  className="h-11 rounded-2xl border-dashed border-[var(--color-border-strong)] text-[var(--color-foreground-muted)]"
                />
              </div>
            ))}
            <Button className="h-11 w-fit rounded-2xl bg-[var(--color-surface-sidebar)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-surface-sidebar)]/95">
              {t("profile.updatePassword")}
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
