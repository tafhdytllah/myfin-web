import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormSubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  pending: boolean;
  disabled?: boolean;
  className?: string;
};

export function FormSubmitButton({
  idleLabel,
  pendingLabel,
  pending,
  disabled,
  className,
}: FormSubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || pending} className={cn(className)}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
