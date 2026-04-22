import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

export function ProfilePageView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account details, password, and session settings."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Profile Info"
          description="Username and email will stay in sync with global sidebar identity."
        >
          <div className="grid gap-4">
            {["Username", "Email"].map((item) => (
              <div key={item} className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-foreground)]">
                  {item}
                </label>
                <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] px-4 py-3 text-sm text-[var(--color-foreground-muted)]">
                  {item} field
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-fit rounded-2xl bg-[var(--color-surface-sidebar)] px-5 py-3 text-sm font-semibold text-white"
            >
              Save Profile
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title="Change Password"
          description="Current password, new password, and confirm password live here."
        >
          <div className="grid gap-4">
            {["Current password", "New password", "Confirm new password"].map((item) => (
              <div key={item} className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-foreground)]">
                  {item}
                </label>
                <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] px-4 py-3 text-sm text-[var(--color-foreground-muted)]">
                  Password field
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-fit rounded-2xl bg-[var(--color-surface-sidebar)] px-5 py-3 text-sm font-semibold text-white"
            >
              Update Password
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
