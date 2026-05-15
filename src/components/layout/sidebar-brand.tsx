"use client";

import Link from "next/link";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { routes } from "@/lib/constants/routes";

type SidebarBrandProps = {
  label: string;
  tooltip: string;
};

export function SidebarBrand({ label, tooltip }: SidebarBrandProps) {
  return (
    <SidebarMenuButton
      render={<Link href={routes.dashboard} />}
      size="lg"
      tooltip={tooltip}
      className="h-14 overflow-visible rounded-2xl px-3 ring-1 ring-sidebar-border data-[active=true]:bg-sidebar-accent group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:px-0"
    >
      <div className="flex size-8 items-center justify-center rounded-xl bg-sidebar-accent font-[var(--font-display)] text-sm font-semibold uppercase text-sidebar-accent-foreground ring-1 ring-sidebar-border transition-transform group-data-[collapsible=icon]:-translate-x-2 group-data-[collapsible=icon]:-translate-y-2">
        M
      </div>
      <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
        <span className="font-[var(--font-display)] text-lg font-semibold">
          {label}
        </span>
      </div>
    </SidebarMenuButton>
  );
}
