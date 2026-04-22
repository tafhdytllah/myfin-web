import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-soft)] sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-primary-strong)]">
          MyFin Workspace
        </p>
        <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-foreground)]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-foreground-muted)]">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
