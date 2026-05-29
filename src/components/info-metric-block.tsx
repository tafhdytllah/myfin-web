import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InfoMetricBlockProps = {
  eyebrow: string;
  value: ReactNode;
  description?: ReactNode;
  className?: string;
  eyebrowClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
};

export function InfoMetricBlock({
  eyebrow,
  value,
  description,
  className,
  eyebrowClassName,
  valueClassName,
  descriptionClassName,
}: InfoMetricBlockProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <p
        className={cn(
          "text-xs uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]",
          eyebrowClassName,
        )}
      >
        {eyebrow}
      </p>
      <div
        className={cn(
          "text-3xl font-semibold text-[var(--color-foreground)]",
          valueClassName,
        )}
      >
        {value}
      </div>
      {description ? (
        <div
          className={cn(
            "text-sm text-[var(--color-foreground-muted)]",
            descriptionClassName,
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
