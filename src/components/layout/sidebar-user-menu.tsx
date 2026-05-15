"use client";

import { ChevronsUpDown, LogOut, Monitor, MoonStar, SunMedium, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { routes } from "@/lib/constants/routes";
import { useLogout } from "@/features/auth/hooks/use-auth-actions";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";
import { useLocaleStore } from "@/stores/locale-store";

const themeOptions = [
  { value: "light", labelKey: "theme.light", icon: SunMedium },
  { value: "dark", labelKey: "theme.dark", icon: MoonStar },
  { value: "system", labelKey: "theme.system", icon: Monitor },
] as const;

export function SidebarUserMenu() {
  const router = useRouter();
  const { t } = useTranslations();
  const { theme, setTheme } = useTheme();
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="h-auto overflow-visible rounded-xl px-3 py-3 data-[active=true]:bg-sidebar-accent group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:px-0"
          />
        }
      >
        <div className="flex size-9 items-center justify-center rounded-full bg-sidebar-accent font-semibold text-sidebar-accent-foreground ring-1 ring-sidebar-border transition-transform group-data-[collapsible=icon]:-translate-x-2 group-data-[collapsible=icon]:-translate-y-2">
          {(user?.username?.[0] ?? "G").toUpperCase()}
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-medium">
            {user?.username ?? t("common.guest")}
          </span>
          <span className="truncate text-xs text-sidebar-foreground/70">
            {user?.email ?? t("common.noActiveSession")}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4 opacity-70 group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 rounded-2xl" side="top">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <div className="grid gap-0.5">
              <span className="font-medium">{user?.username ?? t("common.guest")}</span>
              <span className="text-xs text-muted-foreground">
                {user?.email ?? t("common.noActiveSession")}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(routes.profile)}>
          <UserRound className="size-4" />
          {t("navigation.profile")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("sidebar.language")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(value) => setLocale(value as "en" | "id")}
          >
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
  );
}
