import { Button } from "@/components/ui/button";

type SectionEmptyStateAction = {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
};

type SectionEmptyStateProps = {
  description: string;
  actions?: SectionEmptyStateAction[];
  dashed?: boolean;
};

export function SectionEmptyState({
  description,
  actions,
  dashed = false,
}: SectionEmptyStateProps) {
  return (
    <div
      className={[
        "p-6 text-sm text-muted-foreground",
        dashed
          ? "rounded-2xl border border-dashed border-border"
          : "space-y-4",
      ].join(" ")}
    >
      <p>{description}</p>
      {actions?.length ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? "default"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
