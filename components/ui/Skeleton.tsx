interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Welcome bar skeleton */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-14 w-28 rounded-lg" />
            <Skeleton className="h-14 w-28 rounded-lg" />
            <Skeleton className="h-14 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Widgets skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="mb-4 h-5 w-28" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
