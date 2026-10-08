import { useTranslation } from 'react-i18next'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'

/**
 * Storefront /products grid card.
 * - customer (guest): Bulk option + qty + Add to Cart
 * - company: Min order line + price only (no cart controls)
 * - seller without EuPago extern key: no cart controls, "unavailable" note
 */
export default function ProductListingCard({
  product,
  className = '',
  actions = [],
  onAction,
  role = 'customer',
  showQuantity,
}) {
  const { t } = useTranslation()
  const isCompanyBuyer = role === 'company'
  const isPurchasable = product?.purchasable !== false
  const quantityVisible = isPurchasable && (showQuantity ?? !isCompanyBuyer)
  const baseProduct = isCompanyBuyer
    ? {
        ...product,
        bulkOptionLabel:
          product.minOrderLabel
          || (product.minOrder != null ? `Min: ${product.minOrder}` : undefined),
      }
    : product
  const cardProduct = isPurchasable
    ? baseProduct
    : {
        ...baseProduct,
        unavailableLabel: t('productsPage.unavailableForPurchase', {
          defaultValue: 'Currently unavailable for purchase',
        }),
      }

  return (
    <ProductCard
      type="normal"
      role={role}
      context="listing"
      product={cardProduct}
      actions={isPurchasable ? actions : []}
      onAction={onAction}
      showQuantity={quantityVisible}
      className={className}
    />
  )
}
