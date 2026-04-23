import { PropsWithChildren, ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthFormCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  footer?: ReactNode;
}>;

export function AuthFormCard({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthFormCardProps) {
  return (
    <Card className="rounded-[var(--radius-card)] border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="p-8 pb-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
          {eyebrow}
        </p>
        <CardTitle className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
          {title}
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-[var(--color-foreground-muted)]">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-8">
        {children}
        {footer}
      </CardContent>
    </Card>
  );
}
