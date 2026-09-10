import Skeleton from './Skeleton'
import TableSkeleton from './TableSkeleton'

/**
 * Matches /admin/finance-payments layout:
 * header → 4 stat cards → revenue chart → payouts table → invoices table.
 * Used for route Suspense and future API loading.
 */
export default function FinancePaymentsSkeleton() {
  return (
    <div
      className="space-y-6 sm:space-y-8"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <header className="space-y-2">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`stat-${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-7 w-24" />
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <Skeleton className="mt-6 h-72 w-full rounded-xl sm:h-80" />
        <div className="mt-4 flex justify-center gap-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <TableSkeleton />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <TableSkeleton />
      </section>
    </div>
  )
}
