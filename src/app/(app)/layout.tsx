import { PropsWithChildren } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard mode="private">
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
