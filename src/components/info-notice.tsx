import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type InfoNoticeProps = PropsWithChildren<{
  className?: string;
}>;

export function InfoNotice({ className, children }: InfoNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
