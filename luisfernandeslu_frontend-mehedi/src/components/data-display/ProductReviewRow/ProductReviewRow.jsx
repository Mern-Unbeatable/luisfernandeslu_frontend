import { useTranslation } from 'react-i18next'

/**
 * Row in the “products to review” table (customer account).
 */
export default function ProductReviewRow({
  product,
  onWriteReview,
  className = '',
}) {
  const { t } = useTranslation()
  const shippingLabel =
    product.shippingStatusLabel
    ?? t(`productToReview.shippingStatus.${product.shippingStatus}`, {
      defaultValue: product.shippingStatus,
    })

  return (
    <div
      className={`grid grid-cols-1 gap-4 border-t border-gray-200 px-4 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(120px,160px)_minmax(140px,180px)] sm:items-center sm:px-6 ${className}`}
    >
      <div className="flex min-w-0 gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-md bg-gray-100 sm:size-[88px]">
          {product.image ? (
            <img
              src={product.image}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          {product.title ? (
            <p className="text-base font-bold leading-snug text-[var(--primary-text)]">
              {product.title}
            </p>
          ) : null}
          {product.description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--secondary-text)]">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-sm font-semibold text-emerald-600 sm:text-center">
        <span className="mr-2 text-xs font-medium uppercase tracking-wide text-[var(--secondary-text)] sm:hidden">
          {t('productToReview.columnShipping')}
        </span>
        {shippingLabel}
      </p>

      <div className="sm:flex sm:justify-end">
        <button
          type="button"
          onClick={() => onWriteReview?.(product)}
          className="inline-flex w-full items-center justify-center rounded-md bg-[var(--active)] px-4 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-95 sm:w-auto sm:min-w-[148px]"
        >
          {t('productToReview.writeReview')}
        </button>
      </div>
    </div>
  )
}
