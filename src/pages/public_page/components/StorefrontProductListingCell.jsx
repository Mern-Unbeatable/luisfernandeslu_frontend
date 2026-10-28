import { Link } from 'react-router-dom'
import useOpenSupplierProductChat from '@/features/marketplace/useOpenSupplierProductChat'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
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
  const { t } = useTranslation()
  const detailTo = product?.slug ? `/products/${product.slug}` : null
  const viewerRole = useSelector((state) => state.auth.user?.role)
  const { openSupplierProductChat } = useOpenSupplierProductChat()
  const hideCartActions = role === 'company'
  const supplierViewer = viewerRole === 'supplier'

  if (product?.isFactory || (supplierViewer && detailTo)) {
    const cardTo = product.isFactory
      ? `/supplier/buy-from-factory/${product.id}`
      : detailTo
    return (
      <div className="relative flex h-full min-w-0 flex-1 flex-col">
        <Link
          to={cardTo}
          className="absolute inset-0 z-0 rounded-lg"
          aria-label={product.title}
        />
        <div
          className={`relative z-[1] flex min-w-0 flex-1 flex-col pointer-events-none ${INTERACTIVE_CHILDREN}`}
        >
          <ProductCard
            type="normal"
            role="supplier"
            product={product}
            actions={[
              {
                id: 'send_message',
                kind: 'full',
                label: t('panel.supplierBuyFromFactory.sendMessage'),
                variant: 'primary',
                icon: 'message',
              },
            ]}
            onAction={(actionId) =>
              product.isFactory
                ? onAction?.(actionId, product)
                : openSupplierProductChat(product.id)
            }
            className={className}
          />
        </div>
      </div>
    )
  }

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

  if (hideCartActions) {
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
