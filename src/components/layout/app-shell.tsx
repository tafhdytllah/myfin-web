"use client";

import { PropsWithChildren } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
