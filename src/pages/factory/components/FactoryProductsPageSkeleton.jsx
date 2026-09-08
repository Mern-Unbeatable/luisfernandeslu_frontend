import Skeleton from '@/components/common/Skeleton/Skeleton'
import ProductCardSkeleton from '@/components/data-display/ProductCard/ProductCardSkeleton'

/** Matches factory products list: header + CTAs + toolbar + product card grid. */
export default function FactoryProductsPageSkeleton({ cards = 8 } = {}) {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`tab-${i}`} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: cards }).map((_, i) => (
            <li key={`card-${i}`} className="min-w-0">
              <ProductCardSkeleton className="h-full w-full shadow-sm" />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center gap-2 sm:mt-10">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </section>
    </div>
  )
}
