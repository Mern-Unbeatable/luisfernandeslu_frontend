import Skeleton from "@/components/common/Skeleton/Skeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div
      className="w-full space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`thumb-${index}`}
                className="aspect-square w-full rounded-md"
              />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-8 w-4/5 max-w-xl" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-52" />
          </div>

          <Skeleton className="h-8 w-40" />

          <div className="space-y-5">
            <div>
              <Skeleton className="mb-3 h-5 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[84%]" />
              </div>
            </div>

            <div>
              <Skeleton className="mb-3 h-5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="h-4 w-[72%]" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-12 w-full rounded-full sm:w-40" />
              <Skeleton className="h-12 w-full rounded-full sm:w-40" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-12 w-full rounded-full sm:w-40" />
              <Skeleton className="h-12 w-full rounded-full sm:w-40" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3.5 w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-hidden border-b border-gray-200">
          <div className="flex gap-2 px-3 py-3 sm:px-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`tab-${index}`}
                className="h-8 w-24 rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
