"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/lib/constants/routes";
import { useAuthStore } from "@/stores/auth-store";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    router.replace(isAuthenticated ? routes.dashboard : routes.login);
  }, [isAuthenticated, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] text-[var(--color-foreground-muted)]">
      <p className="text-sm">Redirecting...</p>
    </main>
  );
}
