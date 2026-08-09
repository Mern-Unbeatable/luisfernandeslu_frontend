import ProductCard from '@/components/data-display/ProductCard/ProductCard'

/**
 * Storefront /products grid card.
 * - customer (guest): Bulk option + qty + Add to Cart
 * - company: Min order line + price only (no cart controls)
 */
export default function ProductListingCard({
  product,
  className = '',
  actions = [],
  onAction,
  role = 'customer',
  showQuantity,
}) {
  const isCompanyBuyer = role === 'company'
  const quantityVisible = showQuantity ?? !isCompanyBuyer
  const cardProduct = isCompanyBuyer
    ? {
        ...product,
        bulkOptionLabel: product.minOrderLabel ?? 'Min ord 10 pcs',
      }
    : product

  return (
    <ProductCard
      type="normal"
      role={role}
      context="listing"
      product={cardProduct}
      actions={actions}
      onAction={onAction}
      showQuantity={quantityVisible}
      className={className}
    />
  )
}
