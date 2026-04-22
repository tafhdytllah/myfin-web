import {
  ArrowLeftRight,
  LayoutDashboard,
  Tags,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { routes } from "@/lib/constants/routes";

export const sidebarNavigation: Array<{
  href: string;
  labelKey: string;
  shortcut: string;
  icon: LucideIcon;
}> = [
  {
    href: routes.dashboard,
    labelKey: "navigation.dashboard",
    shortcut: "01",
    icon: LayoutDashboard,
  },
  {
    href: routes.transactions,
    labelKey: "navigation.transactions",
    shortcut: "02",
    icon: ArrowLeftRight,
  },
  {
    href: routes.accounts,
    labelKey: "navigation.accounts",
    shortcut: "03",
    icon: Wallet,
  },
  {
    href: routes.categories,
    labelKey: "navigation.categories",
    shortcut: "04",
    icon: Tags,
  },
];
