import { ReactNode } from "react";

import { ActionMenuTrigger } from "@/components/shared/action-menu-trigger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type RowActionsMenuItem = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

type RowActionsMenuProps = {
  srLabel: string;
  items: RowActionsMenuItem[];
  align?: "start" | "center" | "end";
  triggerClassName?: string;
  triggerSize?: "icon" | "icon-sm";
};

export function RowActionsMenu({
  srLabel,
  items,
  align = "end",
  triggerClassName,
  triggerSize,
}: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <ActionMenuTrigger
        srLabel={srLabel}
        className={triggerClassName}
        size={triggerSize}
      />
      <DropdownMenuContent align={align}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            variant={item.destructive ? "destructive" : undefined}
            disabled={item.disabled}
            onClick={item.onSelect}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
