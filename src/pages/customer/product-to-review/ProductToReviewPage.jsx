import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Pagination from '@/components/common/Pagination/Pagination'
import ProductReviewRow from '@/components/data-display/ProductReviewRow/ProductReviewRow'
import { useGetCustomerPendingReviewsQuery } from '@/features/customer/customerReviewApi'
import { mapCustomerPendingReview } from '@/features/customer/customerReviewMappers'

const PAGE_SIZE = 20

export default function ProductToReviewPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetCustomerPendingReviewsQuery({
    page,
    limit: PAGE_SIZE,
  })

  const products = useMemo(
    () => (data?.products ?? []).map(mapCustomerPendingReview),
    [data?.products],
  )

  const pagination = data?.pagination
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const showInitialLoading = isLoading && !data

  const handleWriteReview = (product) => {
    navigate(`/customer/product-to-review/${product.id}`)
  }

  return (
    <div className="w-full space-y-5">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="hidden border-b border-gray-200 bg-[#F3F4F6] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)] sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(120px,160px)_minmax(140px,180px)]">
          <span>{t('productToReview.columnProducts')}</span>
          <span className="text-center">{t('productToReview.columnShipping')}</span>
          <span className="text-right">{t('productToReview.columnAction')}</span>
        </div>

        {showInitialLoading ? (
          <p className="px-6 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('productToReview.loading')}
          </p>
        ) : isError ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-red-700">
              {error?.data?.message || t('productToReview.loadFailed')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('productToReview.retry')}
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('productToReview.empty')}
          </p>
        ) : (
          <div className={isFetching ? 'opacity-60' : ''}>
            {products.map((product) => (
              <ProductReviewRow
                key={product.id}
                product={product}
                onWriteReview={handleWriteReview}
              />
            ))}
          </div>
        )}
      </div>

      {!showInitialLoading && !isError && products.length > 0 ? (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  )
}
