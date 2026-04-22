type StatusBadgeProps = {
  tone: "active" | "inactive" | "income" | "expense";
  children: string;
};

const toneClasses: Record<StatusBadgeProps["tone"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-200 text-slate-700",
  income: "bg-sky-100 text-sky-700",
  expense: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
