import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Card className="mb-6 rounded-[var(--radius-card)] border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-0 shadow-[var(--shadow-soft)]">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <CardHeader className="gap-0 px-0">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-primary-strong)]">
            MyFin Workspace
          </p>
          <CardTitle className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
            {title}
          </CardTitle>
          <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-foreground-muted)]">
            {description}
          </CardDescription>
        </CardHeader>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
