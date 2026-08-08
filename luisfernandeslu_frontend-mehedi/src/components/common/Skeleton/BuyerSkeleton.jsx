import Skeleton from './Skeleton'

/** Buyer account outlet — dashboard cards / placeholder content. */
export default function BuyerSkeleton({ variant = 'dashboard' }) {
  if (variant === 'placeholder') {
    return (
      <div
        className="rounded-sm border border-gray-200 bg-white p-6 sm:p-8"
        role="status"
        aria-busy="true"
        aria-label="Loading"
      >
        <span className="sr-only">Loading</span>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-8"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      <div className="space-y-3">
        <Skeleton className="h-6 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-sm border border-gray-300 bg-white px-3 py-8 sm:min-h-40 sm:gap-4 sm:px-6 sm:py-10"
          >
            <Skeleton className="size-9 rounded-full sm:size-12" />
            <Skeleton className="h-4 w-16 sm:h-5 sm:w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
