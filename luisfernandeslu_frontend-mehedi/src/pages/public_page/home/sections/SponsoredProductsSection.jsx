import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import Pagination from '@/components/common/Pagination/Pagination'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import {
  SPONSORED_PRODUCTS,
  SPONSORED_PRODUCTS_PAGE_SIZE,
} from '../data/sponsoredProducts'

export default function SponsoredProductsSection() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const user = useSelector((state) => state.auth.user)
  const listingRole = resolveStorefrontBuyerRole(user)

  const totalPages = Math.max(
    1,
    Math.ceil(SPONSORED_PRODUCTS.length / SPONSORED_PRODUCTS_PAGE_SIZE),
  )

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * SPONSORED_PRODUCTS_PAGE_SIZE
    return SPONSORED_PRODUCTS.slice(start, start + SPONSORED_PRODUCTS_PAGE_SIZE)
  }, [page])

  return (
    <section className="w-full bg-[#FEF5E7] py-10 sm:py-12">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-(--primary-text) sm:mb-8 sm:text-2xl">
          {t('home.sponsoredProductsTitle')}
        </h2>

        <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => (
            <li key={product.id} className="flex min-w-0">
              <Link
                to={`/products/${product.slug}`}
                className="flex min-w-0 flex-1 transition-opacity hover:opacity-95"
              >
                <ProductCard
                  type="sponsored"
                  role={listingRole}
                  tag="sponsored"
                  product={product}
                  className="h-full w-full"
                />
              </Link>
            </li>
          ))}
        </ul>

        <Pagination
          className="mt-8 sm:mt-10"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </section>
  )
}
