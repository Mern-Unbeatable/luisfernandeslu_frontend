import Skeleton from '@/components/common/Skeleton/Skeleton'

/**
 * Skeleton loader matching AuctionCard grid layout.
 */
export default function AuctionCardSkeleton() {
  return (
    <article
      className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      {/* Header: Title & status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-48 max-w-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Detail rows */}
      <div className="mt-5 flex flex-col gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`row-${i}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Competing Bids box */}
      <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-xl bg-gray-50 p-4">
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`bid-${i}`}
              className="flex items-center justify-between rounded-lg bg-white p-3 shadow-xs"
            >
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
