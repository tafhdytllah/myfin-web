import { PropsWithChildren, ReactNode } from "react";

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
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
