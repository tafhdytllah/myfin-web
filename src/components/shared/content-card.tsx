import { PropsWithChildren } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ContentCardProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
}>;

export function ContentCard({
  className,
  contentClassName,
  children,
}: ContentCardProps) {
  return (
    <Card
      className={cn(
        "rounded-3xl border-(--color-border) bg-(--color-surface) py-0",
        className,
      )}
    >
      <CardContent className={cn("p-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
