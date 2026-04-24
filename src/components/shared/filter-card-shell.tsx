import { PropsWithChildren, ReactNode } from "react";

import { ResetFiltersButton } from "@/components/shared/reset-filters-button";
import { SectionCard } from "@/components/shared/section-card";

type FilterCardShellProps = PropsWithChildren<{
  title: string;
  description: string;
  hasActiveFilters?: boolean;
  resetLabel?: string;
  onReset?: () => void;
  className?: string;
  action?: ReactNode;
}>;

export function FilterCardShell({
  title,
  description,
  hasActiveFilters,
  resetLabel,
  onReset,
  className,
  action,
  children,
}: FilterCardShellProps) {
  const resolvedAction =
    action ??
    (hasActiveFilters && resetLabel && onReset ? (
      <ResetFiltersButton label={resetLabel} onClick={onReset} />
    ) : null);

  return (
    <SectionCard title={title} description={description} action={resolvedAction}>
      <div className={className}>{children}</div>
    </SectionCard>
  );
}
