import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  tone: "active" | "inactive" | "income" | "expense";
  children: string;
};

const toneClasses: Record<StatusBadgeProps["tone"], string> = {
  active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  inactive: "bg-slate-200 text-slate-700 hover:bg-slate-200",
  income: "bg-sky-100 text-sky-700 hover:bg-sky-100",
  expense: "bg-rose-100 text-rose-700 hover:bg-rose-100",
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </Badge>
  );
}
