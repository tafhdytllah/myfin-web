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
    <Card className="rounded-(--radius-card) border-(--color-border) bg-(--color-surface-elevated) py-0 shadow-(--shadow-soft)">
      <CardHeader className="p-8 pb-0">
        <p className="text-xs uppercase tracking-[0.24em] text-(--color-primary-strong)">
          {eyebrow}
        </p>
        <CardTitle className="mt-3 font-(--font-display) text-3xl text-(--color-foreground)">
          {title}
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-(--color-foreground-muted)">
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
