import Skeleton from '@/components/common/Skeleton/Skeleton'

/**
 * Skeleton loader for DeliveryTimeline cards in delivery logistics pages.
 */
export default function DeliveryTimelineSkeleton({ count = 3 }) {
  return (
    <div
      className="flex w-full flex-col gap-4"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      {Array.from({ length: count }).map((_, idx) => (
        <article
          key={`delivery-card-skeleton-${idx}`}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-4 sm:px-5 sm:py-5"
        >
          {/* Card Header */}
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48 max-w-full" />
              <Skeleton className="h-3 w-28" />
              <div className="mt-1 flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Stepper / Timeline bar */}
          <div className="my-6 px-1">
            <div className="flex items-center justify-between">
              {Array.from({ length: 4 }).map((_, stepIdx) => (
                <div
                  key={`step-${stepIdx}`}
                  className="flex flex-col items-center gap-1.5"
                >
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-3 w-14 sm:w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Address blocks: Pickup & Delivery */}
          <div className="mt-4 grid grid-cols-1 gap-3 border-b border-neutral-100 pb-4 sm:grid-cols-2">
            <div className="space-y-1.5 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="space-y-1.5 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-44 max-w-full" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          {/* Footer action button skeleton */}
          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </article>
      ))}
    </div>
  )
}
