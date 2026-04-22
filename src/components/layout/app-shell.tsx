"use client";

import { PropsWithChildren } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--color-border)] bg-background/80 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <SidebarTrigger className="rounded-xl" />
          </header>
          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
