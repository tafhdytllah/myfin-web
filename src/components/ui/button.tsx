import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary !text-[var(--color-primary-foreground)] visited:!text-[var(--color-primary-foreground)] hover:bg-primary/80 hover:!text-[var(--color-primary-foreground)] active:!text-[var(--color-primary-foreground)] [&:any-link]:!text-[var(--color-primary-foreground)] [&:any-link:hover]:!text-[var(--color-primary-foreground)] [&_svg]:text-[var(--color-primary-foreground)]",
        outline:
          "border-border bg-background !text-[var(--color-foreground)] visited:!text-[var(--color-foreground)] hover:bg-muted hover:!text-[var(--color-foreground)] aria-expanded:bg-muted aria-expanded:!text-[var(--color-foreground)] [&:any-link]:!text-[var(--color-foreground)] [&:any-link:hover]:!text-[var(--color-foreground)] dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary !text-[var(--color-secondary-foreground)] visited:!text-[var(--color-secondary-foreground)] hover:bg-secondary/80 hover:!text-[var(--color-secondary-foreground)] aria-expanded:bg-secondary aria-expanded:!text-[var(--color-secondary-foreground)] [&:any-link]:!text-[var(--color-secondary-foreground)] [&:any-link:hover]:!text-[var(--color-secondary-foreground)]",
        ghost:
          "!text-[var(--color-foreground)] visited:!text-[var(--color-foreground)] hover:bg-muted hover:!text-[var(--color-foreground)] aria-expanded:bg-muted aria-expanded:!text-[var(--color-foreground)] [&:any-link]:!text-[var(--color-foreground)] [&:any-link:hover]:!text-[var(--color-foreground)] dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 !text-destructive visited:!text-destructive hover:bg-destructive/20 hover:!text-destructive [&:any-link]:!text-destructive [&:any-link:hover]:!text-destructive focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "!text-primary visited:!text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type RenderableButtonElementProps = {
  className?: string;
  onClick?: React.MouseEventHandler;
  tabIndex?: number;
  href?: string;
  "data-slot"?: string;
  "aria-disabled"?: boolean;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    nativeButton?: boolean;
    render?: React.ReactElement<RenderableButtonElementProps>;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  nativeButton: _nativeButton,
  render,
  children,
  type,
  disabled,
  ...props
}: ButtonProps) {
  void _nativeButton;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<RenderableButtonElementProps>;
    const childProps = childElement.props;

    return React.cloneElement(childElement, {
      ...props,
      "data-slot": "button",
      className: cn(classes, childProps.className),
      "aria-disabled": disabled || undefined,
      tabIndex: disabled ? -1 : childProps.tabIndex,
      onClick: (event: React.MouseEvent) => {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        childProps.onClick?.(event);
        (props as { onClick?: React.MouseEventHandler }).onClick?.(event);
      },
    });
  }

  if (render && React.isValidElement(render)) {
    const renderedElement = render;
    const renderedProps = renderedElement.props;

    return React.cloneElement(renderedElement, {
      ...props,
      "data-slot": "button",
      className: cn(classes, renderedProps.className),
      "aria-disabled": disabled || undefined,
      tabIndex: disabled ? -1 : renderedProps.tabIndex,
      onClick: (event: React.MouseEvent) => {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        renderedProps.onClick?.(event);
        (props as { onClick?: React.MouseEventHandler }).onClick?.(event);
      },
    });
  }

  return (
    <button
      data-slot="button"
      className={classes}
      disabled={disabled}
      type={type ?? "button"}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
