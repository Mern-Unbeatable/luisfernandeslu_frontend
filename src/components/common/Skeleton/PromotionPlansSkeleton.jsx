import Skeleton from './Skeleton'

/**
 * Matches /admin/promotion-plans layout:
 * header → plan cards row → create/edit form card.
 */
export default function PromotionPlansSkeleton({ asPage = true } = {}) {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="space-y-2">
        {asPage ? (
          <>
            <Skeleton className="h-8 w-56 max-w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </>
        ) : (
          <>
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`plan-card-${index}`}
            className="flex min-w-[11rem] flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>
            <Skeleton className="mt-3 h-5 w-36" />
            <Skeleton className="mt-2 h-4 w-28" />
            <Skeleton className="mt-4 h-9 w-24" />
            <Skeleton className="mt-5 h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <Skeleton className="h-6 w-48" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`field-${index}`} className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-5 h-5 w-32" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
