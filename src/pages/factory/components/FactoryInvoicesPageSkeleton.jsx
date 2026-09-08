import Skeleton from '@/components/common/Skeleton/Skeleton'
import TableSkeleton from '@/components/common/Skeleton/TableSkeleton'

/** Matches factory invoices list: header + data table. */
export default function FactoryInvoicesPageSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="space-y-2">
        <Skeleton className="h-8 w-44 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <TableSkeleton />
    </div>
  )
}
