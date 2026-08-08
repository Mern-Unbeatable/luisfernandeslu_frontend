import Skeleton from './Skeleton'

/** Suspense fallback shaped like the auth login / role-select panel. */
export default function AuthSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-md"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="mt-1 h-12 w-full rounded-lg" />
      </div>

      <div className="mt-5 flex justify-center">
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <Skeleton className="h-4 w-8" />
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}
