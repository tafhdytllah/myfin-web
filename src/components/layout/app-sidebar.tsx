"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "@/lib/constants/routes";
import { sidebarNavigation } from "@/lib/constants/sidebar-navigation";
import { useLocaleStore } from "@/stores/locale-store";

export function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  return (
    <aside className="sticky top-0 hidden h-screen border-r border-white/10 bg-[var(--color-surface-sidebar)] px-5 py-6 text-white lg:flex lg:flex-col">
      <div>
        <Link href={routes.dashboard} className="block rounded-3xl bg-white/8 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-100">MyFin</p>
          <h1 className="mt-2 font-[var(--font-display)] text-2xl font-semibold">
            Financial clarity.
          </h1>
        </Link>
      </div>

      <nav className="mt-8 space-y-2">
        {sidebarNavigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-white text-[var(--color-surface-sidebar)] shadow-[var(--shadow-soft)]"
                  : "text-sky-50 hover:bg-white/10"
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs opacity-60">{item.shortcut}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
          <p className="text-sm text-sky-100">Language</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["en", "id"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLocale(value)}
                className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                  locale === value
                    ? "bg-white text-[var(--color-surface-sidebar)]"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
          <p className="text-sm text-sky-100">Signed in as</p>
          <p className="mt-1 text-base font-medium">demo</p>
          <p className="text-sm text-sky-100">demo@myfin.local</p>
        </div>
      </div>
    </aside>
  );
}
