import { ReactNode } from "react";

import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type TableWorkspaceProps = {
  title: string;
  description?: string;
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
  footerStart?: ReactNode;
  footerEnd?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function TableWorkspace({
  title,
  description,
  toolbarStart,
  toolbarEnd,
  footerStart,
  footerEnd,
  children,
  contentClassName,
}: TableWorkspaceProps) {
  const hasToolbar = Boolean(toolbarStart || toolbarEnd);
  const hasFooter = Boolean(footerStart || footerEnd);

  return (
    <SectionCard title={title} description={description}>
      <div className={cn("space-y-5", contentClassName)}>
        {hasToolbar ? (
          <>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">{toolbarStart}</div>
              {toolbarEnd ? (
                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
                    {toolbarEnd}
                  </div>
              ) : null}
              </div>
            </div>
            <Separator />
          </>
        ) : null}

        {children}

        {hasFooter ? (
          <>
            <Separator />
            <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-muted/10 px-4 py-3 text-sm text-(--color-foreground-muted) md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 font-medium">{footerStart}</div>
              {footerEnd ? <div className="shrink-0">{footerEnd}</div> : null}
            </div>
          </>
        ) : null}
      </div>
    </SectionCard>
  );
}
