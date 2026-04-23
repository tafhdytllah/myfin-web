"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { useCurrentPageTrail } from "@/components/layout/page-trail-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { routes } from "@/lib/constants/routes";
import { useTranslations } from "@/lib/i18n/use-translations";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const trail = useCurrentPageTrail();
  const { t } = useTranslations();

  const routeItems = useMemo(() => {
    const routeMap = new Map<string, string>([
      [routes.dashboard, t("navigation.dashboard")],
      [routes.transactions, t("navigation.transactions")],
      [routes.accounts, t("navigation.accounts")],
      [routes.categories, t("navigation.categories")],
      [routes.profile, t("navigation.profile")],
    ]);

    const currentRoute = routeMap.get(pathname) ?? t("common.appName");

    return [currentRoute, ...trail];
  }, [pathname, t, trail]);

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap overflow-hidden">
        {routeItems.map((item, index) => {
          const isLast = index === routeItems.length - 1;
          const shouldLinkToBase = index === 0 && routeItems.length > 1;

          return (
            <BreadcrumbItem key={`${item}-${index}`} className="min-w-0 shrink-0">
              {shouldLinkToBase ? (
                <BreadcrumbLink
                  render={<Link href={pathname} />}
                  className="truncate"
                >
                  {item}
                </BreadcrumbLink>
              ) : isLast ? (
                <BreadcrumbPage className="truncate text-sm font-medium">
                  {item}
                </BreadcrumbPage>
              ) : (
                <span className="truncate text-sm text-muted-foreground">{item}</span>
              )}
              {!isLast ? <BreadcrumbSeparator /> : null}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
