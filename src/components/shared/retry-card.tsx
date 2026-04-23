"use client";

import { RefreshCw } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";

type RetryCardProps = {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
};

export function RetryCard({
  title,
  description,
  retryLabel,
  onRetry,
}: RetryCardProps) {
  return (
    <SectionCard title={title} description={description}>
      <Button onClick={onRetry} variant="outline" className="rounded-2xl">
        <RefreshCw className="size-4" />
        {retryLabel}
      </Button>
    </SectionCard>
  );
}
