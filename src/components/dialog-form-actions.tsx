import { Button } from "@/components/ui/button";

type DialogFormActionsProps = {
  cancelLabel: string;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onCancel: () => void;
  submitDisabled?: boolean;
};

export function DialogFormActions({
  cancelLabel,
  submitLabel,
  pendingLabel,
  isPending,
  onCancel,
  submitDisabled,
}: DialogFormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={submitDisabled ?? isPending}>
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </div>
  );
}
