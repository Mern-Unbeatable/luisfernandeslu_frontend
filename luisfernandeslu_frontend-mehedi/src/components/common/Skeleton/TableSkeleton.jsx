import Skeleton from './Skeleton'

/** Suspense fallback for DataTable-heavy screens. */
export default function TableSkeleton() {
  return (
    <section
      className="w-full px-0 py-0"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-3">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>

        <div className="mb-2 flex gap-4 bg-[#F6FBFF] px-3 py-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`h-${index}`} className="h-4 flex-1" />
          ))}
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={`r-${rowIndex}`}
              className="flex gap-4 border-b border-gray-100 px-3 py-3.5 last:border-b-0"
            >
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <Skeleton
                  key={`c-${rowIndex}-${colIndex}`}
                  className="h-4 flex-1"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
