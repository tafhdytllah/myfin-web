"use client";

import { PropsWithChildren } from "react";

import { useTranslations } from "@/lib/i18n/use-translations";

export function AuthSplitLayout({ children }: PropsWithChildren) {
  const { t } = useTranslations();

  return (
    <div className="grid min-h-screen bg-(--color-surface) lg:grid-cols-[minmax(320px,30vw)_1fr]">
      <section className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
      <aside className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0_0_0/0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top,oklch(1_0_0/0.08),transparent_35%)]" />
        <div className="absolute inset-0">
          <div className="absolute left-[18%] top-[24%] h-64 w-64 rounded-[2.5rem] border border-sidebar-border bg-sidebar-accent/40 backdrop-blur-sm" />
          <div className="absolute right-[15%] top-[18%] h-72 w-60 rounded-[2rem] border border-sidebar-border bg-sidebar-accent/40 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between px-12 py-14">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-sidebar-border bg-sidebar-accent px-4 py-1 text-sm tracking-[0.2em] uppercase text-sidebar-accent-foreground">
              {t("common.appName")}
            </div>
            <h2 className="max-w-lg font-(--font-display) text-4xl leading-tight">
              {t("auth.heroTitle")}
            </h2>
          </div>
          <div className="grid max-w-xl gap-4 sm:grid-cols-3">
            {[
              { label: t("navigation.dashboard"), value: t("auth.heroDashboard") },
              { label: t("navigation.transactions"), value: t("auth.heroTransactions") },
              { label: t("navigation.accounts"), value: t("auth.heroAccounts") },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-sidebar-border bg-sidebar-accent p-4 backdrop-blur-sm"
              >
                <p className="text-sm text-sidebar-foreground/70">{item.label}</p>
                <p className="mt-2 text-lg font-medium text-sidebar-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
