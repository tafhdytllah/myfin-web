"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-bootstrap";
import { routes } from "@/lib/constants/routes";
import { useAuthStore } from "@/stores/auth-store";

type AuthGuardProps = PropsWithChildren<{
  mode: "public" | "private";
}>;

export function AuthGuard({ children, mode }: AuthGuardProps) {
  const router = useRouter();
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const status = useAuthStore((state) => state.status);

  useAuthBootstrap();

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (mode === "private" && !isAuthenticated) {
      router.replace(routes.login);
    }

    if (mode === "public" && isAuthenticated) {
      router.replace(routes.dashboard);
    }
  }, [hasInitialized, isAuthenticated, mode, router]);

  if (!hasInitialized || status === "bootstrapping") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-5 text-sm text-[var(--color-foreground-muted)] shadow-[var(--shadow-soft)]">
          Restoring your session...
        </div>
      </div>
    );
  }

  if (mode === "private" && !isAuthenticated) {
    return null;
  }

  if (mode === "public" && isAuthenticated) {
    return null;
  }

  return children;
}
