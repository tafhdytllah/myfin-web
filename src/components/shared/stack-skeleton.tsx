type StackSkeletonProps = {
  count: number;
  itemClassName: string;
  className?: string;
};

export function StackSkeleton({
  count,
  itemClassName,
  className = "space-y-3",
}: StackSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={itemClassName} />
      ))}
    </div>
  );
}
