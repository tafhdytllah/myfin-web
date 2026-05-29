import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ItemMetaProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function ItemMeta({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: ItemMetaProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p
        className={cn(
          "truncate font-medium text-[var(--color-foreground)]",
          titleClassName,
        )}
      >
        {title}
      </p>
      {subtitle ? (
        <p
          className={cn(
            "mt-1 text-sm text-[var(--color-foreground-muted)]",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
