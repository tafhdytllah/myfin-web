"use client";

import { PropsWithChildren } from "react";

import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PageTrailProvider } from "@/components/layout/page-trail-context";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <PageTrailProvider>
        <AppSidebar />
        <SidebarInset className="bg-auto">
          <div className="flex max-h-screen flex-col">
            <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-(--color-border) bg-background/80 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
              <SidebarTrigger className="rounded-xl" />
              <div className="min-w-0 flex-1">
                <AppBreadcrumb />
              </div>
            </header>
            <main className="flex-1 px-1 py-1 sm:px-3 sm:py-3 lg:px-5 lg:py-5">
              {children}
            </main>
          </div>
        </SidebarInset>
      </PageTrailProvider>
    </SidebarProvider>
  );
}
