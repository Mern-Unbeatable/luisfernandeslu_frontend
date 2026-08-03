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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-sm border border-gray-300 bg-white px-6 py-10"
          >
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
