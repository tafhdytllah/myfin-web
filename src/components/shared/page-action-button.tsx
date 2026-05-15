import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageActionButtonProps = React.ComponentProps<typeof Button>;

export function PageActionButton({
  className,
  ...props
}: PageActionButtonProps) {
  return (
    <Button
      className={cn("h-11 rounded-2xl px-5 text-sm font-semibold max-sm:w-full", className)}
      {...props}
    />
  );
}
