import { Button } from "@/components/ui/button";

type PageActionButtonProps = React.ComponentProps<typeof Button>;

export function PageActionButton({
  className,
  ...props
}: PageActionButtonProps) {
  return (
    <Button
      className={[
        "h-11 rounded-2xl px-5 text-sm font-semibold max-sm:w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
