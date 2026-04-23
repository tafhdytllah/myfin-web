import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ResetFiltersButtonProps = {
  label: string;
  onClick: () => void;
};

export function ResetFiltersButton({
  label,
  onClick,
}: ResetFiltersButtonProps) {
  return (
    <Button variant="outline" className="rounded-full" onClick={onClick}>
      <RotateCcw className="size-4" />
      {label}
    </Button>
  );
}
