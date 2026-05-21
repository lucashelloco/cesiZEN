import { Skeleton } from "@/components/ui/skeleton";

export default function ContenusLoading() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-40" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-md rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      <Skeleton className="mb-4 h-4 w-24" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 dark:border-base-300 bg-white dark:bg-base-100 p-5">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
