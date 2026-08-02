import Skeleton from './Skeleton'

/** Suspense / page-level fallback shaped like the DataTable layout. */
export default function PageSkeleton() {
  return (
    <section
      className="w-full bg-gray-100 px-4 py-8 sm:px-6 lg:px-10 xl:px-24"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      <div className="mx-auto w-full max-w-[1440px]">
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
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <div className="mb-2 flex gap-4 bg-[#F6FBFF] px-3 py-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={`h-${index}`} className="h-4 flex-1" />
              ))}
            </div>
            <div className="flex flex-col gap-0">
              {Array.from({ length: 7 }).map((_, rowIndex) => (
                <div
                  key={`r-${rowIndex}`}
                  className="flex gap-4 border-b border-gray-100 px-3 py-3.5 last:border-b-0"
                >
                  {Array.from({ length: 8 }).map((_, colIndex) => (
                    <Skeleton
                      key={`c-${rowIndex}-${colIndex}`}
                      className="h-4 flex-1"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
