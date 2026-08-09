import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductReviewRow from '@/components/data-display/ProductReviewRow/ProductReviewRow'
import { PRODUCTS_TO_REVIEW_DEMO } from './data/productToReviewDemo'

export default function ProductToReviewPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="hidden border-b border-gray-200 bg-[#F3F4F6] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)] sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(120px,160px)_minmax(140px,180px)]">
        <span>{t('productToReview.columnProducts')}</span>
        <span className="text-center">{t('productToReview.columnShipping')}</span>
        <span className="text-right">{t('productToReview.columnAction')}</span>
      </div>

      {PRODUCTS_TO_REVIEW_DEMO.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-[var(--secondary-text)]">
          {t('productToReview.empty')}
        </p>
      ) : (
        PRODUCTS_TO_REVIEW_DEMO.map((product) => (
          <ProductReviewRow
            key={product.id}
            product={product}
            onWriteReview={(item) =>
              navigate(`/customer/product-to-review/${item.id}`)
            }
          />
        ))
      )}
    </div>
  )
}
