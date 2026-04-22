import {
  ArrowLeftRight,
  LayoutDashboard,
  Tags,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { routes } from "@/lib/constants/routes";

export const sidebarNavigation: Array<{
  href: string;
  label: string;
  shortcut: string;
  icon: LucideIcon;
}> = [
  { href: routes.dashboard, label: "Dashboard", shortcut: "01", icon: LayoutDashboard },
  {
    href: routes.transactions,
    label: "Transactions",
    shortcut: "02",
    icon: ArrowLeftRight,
  },
  { href: routes.accounts, label: "Accounts", shortcut: "03", icon: Wallet },
  { href: routes.categories, label: "Categories", shortcut: "04", icon: Tags },
  { href: routes.profile, label: "Profile", shortcut: "05", icon: UserRound },
];
