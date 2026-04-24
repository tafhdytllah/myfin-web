import { ComponentPropsWithoutRef, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type FormLayoutProps = PropsWithChildren<
  Omit<ComponentPropsWithoutRef<"form">, "children"> & {
    layout?: "stack" | "grid";
  }
>;

export function FormLayout({
  children,
  className,
  layout = "stack",
  ...props
}: FormLayoutProps) {
  return (
    <form
      className={cn(layout === "grid" ? "grid gap-4" : "space-y-5", className)}
      {...props}
    >
      {children}
    </form>
  );
}
