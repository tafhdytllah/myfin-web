import { PropsWithChildren } from "react";

import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard mode="public">
      <AuthSplitLayout>{children}</AuthSplitLayout>
    </AuthGuard>
  );
}
