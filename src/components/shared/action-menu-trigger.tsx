import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type ActionMenuTriggerProps = {
  srLabel: string;
  size?: "icon" | "icon-sm";
  className?: string;
};

export function ActionMenuTrigger({
  srLabel,
  size = "icon-sm",
  className,
}: ActionMenuTriggerProps) {
  return (
    <DropdownMenuTrigger
      render={<Button variant="ghost" size={size} className={className} />}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">{srLabel}</span>
    </DropdownMenuTrigger>
  );
}
