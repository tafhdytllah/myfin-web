import { PropsWithChildren, ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  action?: ReactNode;
}>;

export function SectionCard({
  title,
  description,
  action,
  children,
}: SectionCardProps) {
  return (
    <Card className="rounded-(--radius-card) border-(--color-border) bg-(--color-surface-elevated) py-0 shadow-(--shadow-soft)">
      <CardHeader className="gap-3 p-6 pb-0 max-sm:grid-cols-1">
        <CardTitle className="text-lg font-semibold text-(--color-foreground)">
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="max-w-2xl text-sm leading-6 text-(--color-foreground-muted)">
            {description}
          </CardDescription>
        ) : null}
        {action ? (
          <CardAction className="max-sm:col-start-1 max-sm:row-start-auto max-sm:row-span-1 max-sm:w-full max-sm:justify-self-stretch">
            {action}
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
