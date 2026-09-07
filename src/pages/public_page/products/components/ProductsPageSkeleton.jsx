import ProductCardSkeleton from '@/components/data-display/ProductCard/ProductCardSkeleton'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import { MARKETPLACE_PRODUCTS_PAGE_SIZE } from '@/features/marketplace/marketplaceApi'

export default function ProductsPageSkeleton() {
  return (
    <div className="w-full bg-white py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          <aside
            className="hidden lg:block lg:w-[292px] lg:shrink-0"
            aria-hidden
          >
            <div className="space-y-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={`filter-${i}`} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 hidden lg:mb-6 lg:block">
              <Skeleton className="h-4 w-40" />
            </div>
            <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {Array.from({ length: MARKETPLACE_PRODUCTS_PAGE_SIZE }, (_, i) => (
                <li key={`products-skel-${i}`} className="flex h-full min-w-0">
                  <ProductCardSkeleton className="h-full w-full" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
