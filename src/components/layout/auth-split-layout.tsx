"use client";

import { PropsWithChildren } from "react";

import { useTranslations } from "@/lib/i18n/use-translations";

export function AuthSplitLayout({ children }: PropsWithChildren) {
  const { t } = useTranslations();

  return (
    <div className="grid min-h-screen bg-[var(--color-surface)] lg:grid-cols-[minmax(320px,30vw)_1fr]">
      <section className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
      <aside className="relative hidden overflow-hidden bg-[var(--color-surface-sidebar)] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(86,182,255,0.3),_transparent_35%),linear-gradient(160deg,_rgba(9,40,74,0.9)_10%,_rgba(18,58,103,1)_55%,_rgba(40,111,177,0.95)_100%)]" />
        <div className="absolute inset-0">
          <div className="absolute left-[10%] top-[10%] h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[12%] right-[12%] h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="absolute left-[18%] top-[24%] h-64 w-64 rounded-[2.5rem] border border-white/10 bg-white/8 backdrop-blur-sm" />
          <div className="absolute right-[15%] top-[18%] h-72 w-60 rounded-[2rem] border border-white/10 bg-white/8 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between px-12 py-14 text-white">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm tracking-[0.2em] uppercase text-sky-100">
              {t("common.appName")}
            </div>
            <h2 className="max-w-lg font-[var(--font-display)] text-4xl font-semibold leading-tight">
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
                className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm"
              >
                <p className="text-sm text-sky-100">{item.label}</p>
                <p className="mt-2 text-lg font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
