"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarBrand } from "@/components/layout/sidebar-brand";
import { SidebarUserMenu } from "@/components/layout/sidebar-user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslations } from "@/lib/i18n/use-translations";
import { sidebarNavigation } from "@/lib/constants/sidebar-navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { t } = useTranslations();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, pathname, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" className="border-r-0" variant="sidebar">
      <SidebarHeader className="bg-[var(--color-surface-sidebar)] p-4 text-sidebar-foreground">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarBrand
              label={String(t("common.appName")).toLowerCase()}
              tooltip={t("common.appName")}
            />
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
            <SidebarUserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
