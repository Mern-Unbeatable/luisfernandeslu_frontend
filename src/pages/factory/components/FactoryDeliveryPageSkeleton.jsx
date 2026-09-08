import Skeleton from '@/components/common/Skeleton/Skeleton'
import AuctionCardSkeleton from '@/components/common/Skeleton/AuctionCardSkeleton'

function AuctionSectionSkeleton({ cards = 4 }) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 max-w-full" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <AuctionCardSkeleton key={`auction-${i}`} />
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </section>
  )
}

/** Matches factory delivery logistics list: header + two auction grids. */
export default function FactoryDeliveryPageSkeleton() {
  return (
    <div
      className="space-y-8"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>

      <AuctionSectionSkeleton />
      <AuctionSectionSkeleton />
    </div>
  )
}
