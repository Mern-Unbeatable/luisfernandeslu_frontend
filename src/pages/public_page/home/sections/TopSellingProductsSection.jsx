import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StorefrontProductListingCell from '../../components/StorefrontProductListingCell'
import Pagination from '@/components/common/Pagination/Pagination'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import useScrollToSectionOnPageChange from '../hooks/useScrollToSectionOnPageChange'
import HomeStatsBar from './HomeStatsBar'
import {
  TOP_SELLING_PAGE_SIZE,
  TOP_SELLING_PRODUCTS,
  TOP_SELLING_TOTAL_PAGES,
} from '../data/topSellingProducts'

export default function TopSellingProductsSection() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const listingRole = resolveStorefrontBuyerRole(user)

  const totalPages = Math.max(
    1,
    Math.min(
      TOP_SELLING_TOTAL_PAGES,
      Math.ceil(TOP_SELLING_PRODUCTS.length / TOP_SELLING_PAGE_SIZE),
    ),
  )
  const safePage = Math.min(page, totalPages)

  const listingRef = useScrollToSectionOnPageChange(safePage)

  const handleListingAction = useCallback(
    (actionId, product) => {
      if (actionId === 'add_to_cart') {
        navigate('/cart')
        return
      }
      if (actionId === 'view_details' && product?.slug) {
        navigate(`/products/${product.slug}`)
      }
    },
    [navigate],
  )

  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * TOP_SELLING_PAGE_SIZE
    return TOP_SELLING_PRODUCTS.slice(start, start + TOP_SELLING_PAGE_SIZE)
  }, [safePage])

  return (
    <section className="w-full bg-[#F9FAFB] py-10 sm:py-12">
      <div className="container mx-auto w-full space-y-10 px-4 sm:px-6 lg:space-y-12 lg:px-8">
        <HomeStatsBar />

        <div>
          <h2
            ref={listingRef}
            className="mb-6 scroll-mt-[5rem] text-xl font-bold text-(--primary-text) sm:mb-8 sm:scroll-mt-[10rem] sm:text-2xl"
          >
            {t('home.topSellingTitle')}
          </h2>

          <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {visibleProducts.map((product) => (
              <li key={product.id} className="flex min-w-0">
                <StorefrontProductListingCell
                  product={product}
                  role={listingRole}
                  onAction={handleListingAction}
                />
              </li>
            ))}
          </ul>

          <Pagination
            className="mt-8 sm:mt-10"
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  )
}
