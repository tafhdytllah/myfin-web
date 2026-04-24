"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-bootstrap";
import { routes } from "@/lib/constants/routes";
import { useAuthStore } from "@/stores/auth-store";

export default function HomePage() {
  const router = useRouter();
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const status = useAuthStore((state) => state.status);

  useAuthBootstrap();

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    router.replace(isAuthenticated ? routes.dashboard : routes.login);
  }, [hasInitialized, isAuthenticated, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-surface) text-(--color-foreground-muted)">
      <p className="text-sm">
        {status === "bootstrapping" ? "Restoring session..." : "Redirecting..."}
      </p>
    </main>
  );
}
