import { SectionCard } from "@/components/shared/section-card";
import { StackSkeleton } from "@/components/shared/stack-skeleton";
import { cn } from "@/lib/utils";

type SectionCardSkeletonGridProps = {
  count: number;
  gridClassName?: string;
  skeletonCount: number;
  skeletonClassName?: string;
  skeletonItemClassName: string;
};

export function SectionCardSkeletonGrid({
  count,
  gridClassName,
  skeletonCount,
  skeletonClassName,
  skeletonItemClassName,
}: SectionCardSkeletonGridProps) {
  return (
    <div className={cn("grid gap-4", gridClassName)}>
      {Array.from({ length: count }).map((_, index) => (
        <SectionCard key={index} title=" ">
          <StackSkeleton
            count={skeletonCount}
            itemClassName={skeletonItemClassName}
            className={skeletonClassName}
          />
        </SectionCard>
      ))}
    </div>
  );
}
