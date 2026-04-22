"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, LogOut } from "lucide-react";

import { useLogout } from "@/features/auth/hooks/use-auth-actions";
import { routes } from "@/lib/constants/routes";
import { sidebarNavigation } from "@/lib/constants/sidebar-navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useLocaleStore } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

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
          const Icon = item.icon;

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
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                <span>{item.label}</span>
              </span>
              <span className="text-xs opacity-60">{item.shortcut}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Card className="rounded-3xl border-white/10 bg-white/8 py-0 text-white ring-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-sky-100">
              <Languages className="size-4" />
              <p>Language</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["en", "id"] as const).map((value) => (
                <Button
                  key={value}
                  onClick={() => setLocale(value)}
                  variant={locale === value ? "secondary" : "ghost"}
                  className={`rounded-2xl ${
                    locale === value
                      ? "bg-white text-[var(--color-surface-sidebar)] hover:bg-white/90"
                      : "text-white hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {value.toUpperCase()}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/10 bg-white/8 py-0 text-white ring-0">
          <CardContent className="p-4">
            <p className="text-sm text-sky-100">Signed in as</p>
            <p className="mt-1 text-base font-medium">{user?.username ?? "Guest"}</p>
            <p className="text-sm text-sky-100">{user?.email ?? "No active session"}</p>
            <Button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              variant="outline"
              className="mt-4 w-full rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-4" />
              {logoutMutation.isPending ? "Signing out..." : "Logout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
