"use client";

import Link from "next/link";
import {
  ChevronsUpDown,
  LogOut,
  Monitor,
  MoonStar,
  SunMedium,
  UserRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useLogout } from "@/features/auth/hooks/use-auth-actions";
import { useTranslations } from "@/lib/i18n/use-translations";
import { routes } from "@/lib/constants/routes";
import { sidebarNavigation } from "@/lib/constants/sidebar-navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useLocaleStore } from "@/stores/locale-store";

const themeOptions = [
  { value: "light", labelKey: "theme.light", icon: SunMedium },
  { value: "dark", labelKey: "theme.dark", icon: MoonStar },
  { value: "system", labelKey: "theme.system", icon: Monitor },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslations();
  const { theme, setTheme } = useTheme();
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  return (
    <Sidebar collapsible="icon" className="border-r-0" variant="sidebar">
      <SidebarHeader className="bg-[var(--color-surface-sidebar)] p-4 text-sidebar-foreground">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href={routes.dashboard} />}
              size="lg"
              tooltip={t("common.appName")}
              className="h-14 rounded-3xl bg-white/8 px-3 ring-1 ring-white/10 hover:bg-white/12 data-[active=true]:bg-white/12 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-2xl group-data-[collapsible=icon]:px-0"
            >
              <div className="flex size-8 items-center justify-center rounded-2xl bg-sidebar-primary font-[var(--font-display)] text-sm font-semibold uppercase text-sidebar-primary-foreground">
                M
              </div>
              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-[var(--font-display)] text-lg font-semibold">
                  {String(t("common.appName")).toLowerCase()}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[var(--color-surface-sidebar)] px-2 text-sidebar-foreground">
        <SidebarMenu>
          {sidebarNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={pathname === item.href}
                  tooltip={t(item.labelKey)}
                  className="h-11 rounded-2xl px-3 text-sm data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                >
                  <Icon className="size-4" />
                  <span>{t(item.labelKey)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="gap-4 bg-[var(--color-surface-sidebar)] p-4 text-sidebar-foreground">
        <SidebarSeparator className="bg-white/10" />

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-auto rounded-2xl bg-white/8 px-3 py-3 hover:bg-white/12 data-[active=true]:bg-sidebar-accent group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-2xl group-data-[collapsible=icon]:px-0"
                  />
                }
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
                  {(user?.username?.[0] ?? "G").toUpperCase()}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">
                    {user?.username ?? t("common.guest")}
                  </span>
                  <span className="truncate text-xs text-sky-100 dark:text-slate-300">
                    {user?.email ?? t("common.noActiveSession")}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 opacity-70 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 rounded-2xl"
                side="top"
              >
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="grid gap-0.5">
                    <span className="font-medium">
                      {user?.username ?? t("common.guest")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email ?? t("common.noActiveSession")}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push(routes.profile)}>
                  <UserRound className="size-4" />
                  {t("navigation.profile")}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t("sidebar.language")}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as "en" | "id")}>
                    <DropdownMenuRadioItem value="en">EN</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="id">ID</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t("theme.title")}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    {themeOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                          <Icon className="size-4" />
                          {t(option.labelKey)}
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  variant="destructive"
                >
                  <LogOut className="size-4" />
                  {logoutMutation.isPending ? t("sidebar.signingOut") : t("sidebar.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
