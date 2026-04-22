import { PropsWithChildren } from "react";

import { AuthSplitLayout } from "@/components/layout/auth-split-layout";

export default function AuthLayout({ children }: PropsWithChildren) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
