import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StorefrontProductListingCell from '../../components/StorefrontProductListingCell'
import ProductCardSkeleton from '@/components/data-display/ProductCard/ProductCardSkeleton'
import Pagination from '@/components/common/Pagination/Pagination'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import {
  TOP_SELLING_PRODUCTS_PAGE_SIZE,
  useGetTopSellingProductsQuery,
} from '@/features/marketplace/marketplaceApi'
import useHomeSectionPagination from '../hooks/useHomeSectionPagination'
import HomeStatsBar from './HomeStatsBar'
import useCartAction from '@/hooks/useCartAction'

function resolveListingRole(viewer, user) {
  if (
    viewer?.isCompany
    || viewer?.role === 'company'
    || viewer?.pricingView === 'company'
  ) {
    return 'company'
  }
  if (viewer?.role === 'customer' || viewer?.role === 'guest') {
    return 'customer'
  }
  return resolveStorefrontBuyerRole(user)
}

export default function TopSellingProductsSection() {
  const { t } = useTranslation()
  const { page, changePage, setPage, anchorRef } = useHomeSectionPagination(1)
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const authRole = resolveStorefrontBuyerRole(user)
  const { handleAddToCart } = useCartAction()

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetTopSellingProductsQuery({
    page,
    limit: TOP_SELLING_PRODUCTS_PAGE_SIZE,
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

  const handleListingAction = useCallback(
    async (actionId, product) => {
      if (actionId === 'add_to_cart') {
        return handleAddToCart(product?.id, product?.defaultQuantity ?? 1)
      }
      if (actionId === 'view_details' && product?.slug) {
        navigate(`/products/${product.slug}`)
      }
    },
    [navigate, handleAddToCart],
  )

  return (
    <section className="w-full bg-[#F9FAFB] py-10 sm:py-12">
      <div className="container mx-auto w-full space-y-10 px-4 sm:px-6 lg:space-y-12 lg:px-8">
        <HomeStatsBar />

        <div>
          <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2
              ref={anchorRef}
              className="scroll-mt-[8.5rem] text-xl font-bold text-(--primary-text) sm:scroll-mt-[10rem] sm:text-2xl"
            >
              {t('home.topSellingTitle')}
            </h2>
            {isCompanyView ? (
              <p className="text-xs font-medium text-[var(--active)] sm:text-sm">
                {t('home.topSellingCompanyPricing', {
                  defaultValue: 'Company pricing shown',
                })}
              </p>
            ) : null}
          </div>

          {isLoading && !data ? (
            <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: TOP_SELLING_PRODUCTS_PAGE_SIZE }, (_, i) => (
                <li key={`top-selling-skel-${i}`} className="flex min-w-0">
                  <ProductCardSkeleton className="h-full w-full" />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
              <p className="text-sm text-red-700">
                {error?.data?.message
                  || t('home.topSellingLoadFailed', {
                    defaultValue: 'Could not load top selling products.',
                  })}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
              >
                {t('home.topSellingRetry', { defaultValue: 'Try again' })}
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
              {t('home.topSellingEmpty', {
                defaultValue: 'No top selling products right now.',
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
                  <StorefrontProductListingCell
                    product={product}
                    role={listingRole}
                    onAction={handleListingAction}
                  />
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
      </div>
    </section>
  )
}
