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
      className="h-14 overflow-visible rounded-3xl bg-white/8 px-3 ring-1 ring-white/10 hover:bg-white/12 data-[active=true]:bg-white/12 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-2xl group-data-[collapsible=icon]:px-0"
    >
      <div className="flex size-8 items-center justify-center rounded-2xl bg-sidebar-primary font-[var(--font-display)] text-sm font-semibold uppercase text-sidebar-primary-foreground shadow-lg shadow-black/10 transition-transform group-data-[collapsible=icon]:-translate-x-2 group-data-[collapsible=icon]:-translate-y-2">
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
