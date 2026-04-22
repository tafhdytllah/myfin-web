import { routes } from "@/lib/constants/routes";

export const sidebarNavigation = [
  { href: routes.dashboard, label: "Dashboard", shortcut: "01" },
  { href: routes.transactions, label: "Transactions", shortcut: "02" },
  { href: routes.accounts, label: "Accounts", shortcut: "03" },
  { href: routes.categories, label: "Categories", shortcut: "04" },
  { href: routes.profile, label: "Profile", shortcut: "05" },
];
