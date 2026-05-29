import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  tone: "active" | "inactive" | "income" | "expense";
  children: string;
};

const toneClasses: Record<StatusBadgeProps["tone"], string> = {
  active:
    "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/18 dark:text-emerald-200 dark:hover:bg-emerald-500/18",
  inactive:
    "bg-muted text-muted-foreground hover:bg-muted dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted",
  income:
    "bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/18 dark:text-sky-200 dark:hover:bg-sky-500/18",
  expense:
    "bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/18 dark:text-rose-200 dark:hover:bg-rose-500/18",
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </Badge>
  );
}
