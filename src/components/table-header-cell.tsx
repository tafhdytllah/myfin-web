import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TableHeaderCellProps = React.ComponentProps<typeof TableHead>;

export function TableHeaderCell({
  className,
  ...props
}: TableHeaderCellProps) {
  return (
    <TableHead
      className={cn("text-[var(--color-foreground-muted)]", className)}
      {...props}
    />
  );
}
