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
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-lg font-semibold text-(--color-foreground)">
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="text-sm text-(--color-foreground-muted)">
            {description}
          </CardDescription>
        ) : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
