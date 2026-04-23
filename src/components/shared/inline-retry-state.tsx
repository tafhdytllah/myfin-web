"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type InlineRetryStateProps = {
  description: string;
  retryLabel: string;
  onRetry: () => void;
};

export function InlineRetryState({
  description,
  retryLabel,
  onRetry,
}: InlineRetryStateProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" />
        {retryLabel}
      </Button>
    </div>
  );
}
