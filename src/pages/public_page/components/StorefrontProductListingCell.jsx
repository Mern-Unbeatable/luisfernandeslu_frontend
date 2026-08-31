import { Link } from 'react-router-dom'
import ProductListingCard from '@/components/data-display/ProductListingCard/ProductListingCard'

/** Keeps cart/qty buttons clickable while the rest of the card opens the PDP. */
const INTERACTIVE_CHILDREN = '[&_button]:pointer-events-auto [&_a]:pointer-events-auto'

/**
 * Storefront-only listing cell: navigates to `/products/:slug` without changing shared cards.
 */
export default function StorefrontProductListingCell({
  product,
  role,
  onAction,
  className = 'h-full w-full',
}) {
  const detailTo = product?.slug ? `/products/${product.slug}` : null
  const isCompanyBuyer = role === 'company'

  if (!detailTo) {
    return (
      <ProductListingCard
        product={product}
        role={role}
        onAction={onAction}
        className={className}
      />
    )
  }

  if (isCompanyBuyer) {
    return (
      <Link to={detailTo} className="flex h-full min-w-0 flex-1">
        <ProductListingCard
          product={product}
          role={role}
          actions={[]}
          onAction={onAction}
          className={className}
        />
      </Link>
    )
  }

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col">
      <Link
        to={detailTo}
        className="absolute inset-0 z-0 rounded-lg"
        aria-label={product.title}
      />
      <div
        className={`relative z-[1] flex min-w-0 flex-1 flex-col pointer-events-none ${INTERACTIVE_CHILDREN}`}
      >
        <ProductListingCard
          product={product}
          role={role}
          onAction={onAction}
          className={className}
        />
      </div>
    </div>
  )
}
