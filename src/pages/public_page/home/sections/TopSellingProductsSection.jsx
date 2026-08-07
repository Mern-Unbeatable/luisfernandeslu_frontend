import { useMemo, useState } from 'react'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import Pagination from '@/components/common/Pagination/Pagination'
import HomeStatsBar from './HomeStatsBar'
import {
  TOP_SELLING_PAGE_SIZE,
  TOP_SELLING_PRODUCTS,
  TOP_SELLING_TOTAL_PAGES,
} from '../data/topSellingProducts'

export default function TopSellingProductsSection() {
  const [page, setPage] = useState(1)

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * TOP_SELLING_PAGE_SIZE
    return TOP_SELLING_PRODUCTS.slice(start, start + TOP_SELLING_PAGE_SIZE)
  }, [page])

  return (
    <section className="w-full bg-[#F9FAFB] py-10 sm:py-12">
      <div className="container mx-auto w-full space-y-10 px-4 sm:px-6 lg:space-y-12 lg:px-8">
        <HomeStatsBar />

        <div>
          <h2 className="mb-6 text-xl font-bold text-(--primary-text) sm:mb-8 sm:text-2xl">
            Top Selling Product
          </h2>

          <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {visibleProducts.map((product) => (
              <li key={product.id} className="flex min-w-0">
                <ProductCard
                  type="normal"
                  role="customer"
                  showQuantity
                  product={product}
                  className="h-full w-full"
                />
              </li>
            ))}
          </ul>

          <Pagination
            className="mt-8 sm:mt-10"
            page={page}
            totalPages={TOP_SELLING_TOTAL_PAGES}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  )
}
