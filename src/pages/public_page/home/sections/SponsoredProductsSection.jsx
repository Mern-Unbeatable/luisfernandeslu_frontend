import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import ProductCardSkeleton from '@/components/data-display/ProductCard/ProductCardSkeleton'
import Pagination from '@/components/common/Pagination/Pagination'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import {
  SPONSORED_PRODUCTS_PAGE_SIZE,
  useGetSponsoredProductsQuery,
} from '@/features/marketplace/marketplaceApi'
import useHomeSectionPagination from '../hooks/useHomeSectionPagination'

function resolveListingRole(viewer, user) {
  if (viewer?.isCompany || viewer?.role === 'company' || viewer?.pricingView === 'company') {
    return 'company'
  }
  if (viewer?.role === 'customer' || viewer?.role === 'guest') {
    return 'customer'
  }
  return resolveStorefrontBuyerRole(user)
}

export default function SponsoredProductsSection() {
  const { t } = useTranslation()
  const { page, changePage, setPage, anchorRef } = useHomeSectionPagination(1)
  const user = useSelector((state) => state.auth.user)
  const authRole = resolveStorefrontBuyerRole(user)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetSponsoredProductsQuery({
    page,
    limit: SPONSORED_PRODUCTS_PAGE_SIZE,
    // Cache separately per buyer type so company B2B prices don't leak to guests.
    pricingView: authRole === 'company' ? 'company' : 'retail',
  })

  const products = data?.products ?? []
  const pagination = data?.pagination
  const listingRole = useMemo(
    () => resolveListingRole(data?.viewer, user),
    [data?.viewer, user],
  )
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)
  const isCompanyView = listingRole === 'company'

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages, setPage])

  return (
    <section
      ref={anchorRef}
      className="w-full scroll-mt-24 bg-[#FEF5E7] py-10 sm:scroll-mt-28 sm:py-12"
    >
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <h2 className="text-xl font-bold text-(--primary-text) sm:text-2xl">
            {t('home.sponsoredProductsTitle')}
          </h2>
          {isCompanyView ? (
            <p className="text-xs font-medium text-[var(--active)] sm:text-sm">
              {t('home.sponsoredProductsCompanyPricing', {
                defaultValue: 'Company pricing shown',
              })}
            </p>
          ) : null}
        </div>

        {isLoading && !data ? (
          <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: SPONSORED_PRODUCTS_PAGE_SIZE }, (_, i) => (
              <li key={`sponsored-skel-${i}`} className="flex min-w-0">
                <ProductCardSkeleton className="h-full w-full" />
              </li>
            ))}
          </ul>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">
              {error?.data?.message
                || t('home.sponsoredProductsLoadFailed', {
                  defaultValue: 'Could not load sponsored products.',
                })}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('home.sponsoredProductsRetry', { defaultValue: 'Try again' })}
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('home.sponsoredProductsEmpty', {
              defaultValue: 'No sponsored products right now.',
            })}
          </p>
        ) : (
          <ul
            className={[
              'grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6',
              isFetching ? 'opacity-60' : '',
            ].join(' ')}
          >
            {products.map((product) => (
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
        )}

        {!isLoading && !isError && products.length > 0 ? (
          <Pagination
            className="mt-8 sm:mt-10"
            page={safePage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        ) : null}
      </div>
    </section>
  )
}
