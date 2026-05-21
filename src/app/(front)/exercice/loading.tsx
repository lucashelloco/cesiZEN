import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciceLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg border border-gray-200 dark:border-base-300 bg-white dark:bg-base-100 p-5">
        <Skeleton className="mb-4 h-5 w-44" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-base-300 p-3">
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-base-300 bg-white dark:bg-base-100 p-5">
        <Skeleton className="mb-4 h-5 w-52" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="mt-2 h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
