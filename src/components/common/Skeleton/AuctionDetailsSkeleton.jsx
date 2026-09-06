import Skeleton from '@/components/common/Skeleton/Skeleton'

/**
 * Skeleton loader for AuctionDetails / DeliveryDetails page view.
 */
export default function AuctionDetailsSkeleton() {
  return (
    <div
      className="mx-auto w-full space-y-5"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      {/* Back button skeleton */}
      <Skeleton className="mb-5 h-5 w-20" />

      {/* Order Summary Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`summary-${i}`} className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </div>
      </div>

      {/* Two-column section: Customer & Shipping */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
      </div>

      {/* Product Info Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-56" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`product-${i}`} className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
