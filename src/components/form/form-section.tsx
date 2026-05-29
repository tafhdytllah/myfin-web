import { ComponentPropsWithoutRef, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type FormSectionProps = PropsWithChildren<
  Omit<ComponentPropsWithoutRef<"form">, "children"> & {
    layout?: "stack" | "grid";
  }
>;

export function FormSection({
  children,
  className,
  layout = "stack",
  ...props
}: FormSectionProps) {
  return (
    <form
      className={cn(layout === "grid" ? "grid gap-4" : "space-y-5", className)}
      {...props}
    >
      {children}
    </form>
  );
}
