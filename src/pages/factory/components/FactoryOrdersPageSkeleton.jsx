import Skeleton from '@/components/common/Skeleton/Skeleton'
import TableSkeleton from '@/components/common/Skeleton/TableSkeleton'

/** Matches factory orders list: header + metric cards + data table. */
export default function FactoryOrdersPageSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="space-y-2">
        <Skeleton className="h-8 w-48 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`metric-${i}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        ))}
      </div>

      <TableSkeleton />
    </div>
  )
}
