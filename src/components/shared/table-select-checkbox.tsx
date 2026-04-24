"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type TableSelectCheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
  className?: string;
};

export function TableSelectCheckbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  ariaLabel,
  className,
}: TableSelectCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-label={ariaLabel}
      className={cn(
        "size-4 rounded border border-input bg-background text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      onChange={(event) => onCheckedChange(event.target.checked)}
    />
  );
}
