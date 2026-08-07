import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import BulkPricingTable from './BulkPricingTable'
import ImageGallery from './ImageGallery'
import ProductActions from './ProductActions'
import ProductTabs from './ProductTabs'
import SellerCard from './SellerCard'
import { resolveDetailsView } from './resolveDetailsView'

/**
 * Common product details — layout driven by `role`.
 * roles: customer | company | supplier | factory | admin
 */
export default function ProductDetails({
  role = 'customer',
  context = 'default',
  product = {},
  quantity: quantityProp,
  onQuantityChange,
  onAction,
  className = '',
}) {
  const view = resolveDetailsView(role, context)
  const [quantity, setQuantity] = useState(quantityProp ?? 1)

  const actionLayout =
    role === 'admin' ? 'admin' : role === 'company' ? 'company' : 'customer'

  const changeQty = (next) => {
    setQuantity(next)
    onQuantityChange?.(next)
  }

  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : []

  const rating = product.rating ?? 0
  const fullStars = Math.round(rating)

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="">
        <div className="grid gap-8 lg:grid-cols-2">
          <ImageGallery images={images} alt={product.title || 'Product'} />

          <div className="flex min-w-0 flex-col gap-4">
            {view.showRating ? (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar
                      key={index}
                      className={`size-4 ${
                        index < fullStars
                          ? 'fill-[var(--active)] text-[var(--active)]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-[var(--primary-text)]">
                  {rating} Star Rating
                </span>
                {product.feedbackCount != null ? (
                  <span className="text-[var(--secondary-text)]">
                    ({Number(product.feedbackCount).toLocaleString()} User
                    feedback)
                  </span>
                ) : null}
              </div>
            ) : null}

            <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
              {product.title}
            </h1>

            {view.showWarehouse ? (
              <div className="space-y-1 text-sm text-[var(--secondary-text)]">
                {product.sku ? (
                  <p>
                    <span className="text-[var(--secondary-text)]">Sku: </span>
                    <span className="text-[var(--primary-text)]">{product.sku}</span>
                  </p>
                ) : null}
                {product.availability ? (
                  <p>
                    <span className="text-[var(--secondary-text)]">
                      Availability:{' '}
                    </span>
                    <span className="font-medium text-emerald-600">
                      {product.availability}
                    </span>
                  </p>
                ) : null}
                {product.category ? (
                  <p>
                    <span className="text-[var(--secondary-text)]">
                      Category:{' '}
                    </span>
                    <span className="text-[var(--primary-text)]">
                      {product.category}
                    </span>
                  </p>
                ) : null}
                {product.warehouse ? (
                  <p>
                    <span className="text-[var(--secondary-text)]">
                      Warehouse location:{' '}
                    </span>
                    <span className="text-[var(--primary-text)]">
                      {product.warehouse}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 text-sm">
                <div className="min-w-0 space-y-1 text-[var(--secondary-text)]">
                  {product.sku ? (
                    <p>
                      <span className="text-[var(--secondary-text)]">Sku: </span>
                      <span className="text-[var(--primary-text)]">
                        {product.sku}
                      </span>
                    </p>
                  ) : null}
                  {product.category ? (
                    <p>
                      <span className="text-[var(--secondary-text)]">
                        Category:{' '}
                      </span>
                      <span className="text-[var(--primary-text)]">
                        {product.category}
                      </span>
                    </p>
                  ) : null}
                </div>
                {product.availability ? (
                  <p className="shrink-0 text-right">
                    <span className="text-[var(--secondary-text)]">
                      Availability:{' '}
                    </span>
                    <span className="font-medium text-emerald-600">
                      {product.availability}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            {view.splitPrice && product.price ? (
              <p className="text-xl sm:text-2xl">
                <span className="font-bold text-[var(--active)]">
                  {product.price}
                </span>
                {product.unit ? (
                  <span className="font-bold text-[var(--primary-text)]">
                    {' '}
                    Per {product.unit}
                  </span>
                ) : null}
              </p>
            ) : product.priceText ? (
              <p className="text-xl font-bold text-[var(--active)] sm:text-2xl">
                {product.priceText}
              </p>
            ) : product.price ? (
              <p className="text-xl font-bold text-[var(--active)] sm:text-2xl">
                {product.price}
                {product.unit ? ` Per ${product.unit}` : ''}
              </p>
            ) : null}

            <BulkPricingTable tiers={product.bulkPricing || []} />

            {view.showInlineDescription ? (
              <div className="space-y-5">
                <div>
                  <h2 className="mb-2 text-base font-bold text-[var(--primary-text)]">
                    Description
                  </h2>
                  <div className="space-y-3 text-sm leading-relaxed text-[var(--secondary-text)]">
                    {(product.descriptionParagraphs || [product.description])
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
                {product.features?.length ? (
                  <div>
                    <h2 className="mb-2 text-base font-bold text-[var(--primary-text)]">
                      Feature
                    </h2>
                    <ul className="space-y-2 text-sm text-[var(--secondary-text)]">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--active)]"
                            aria-hidden
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {view.showMinOrder && product.minOrder ? (
              <p className="text-sm font-bold text-red-500">
                Minimum Order {product.minOrder}
              </p>
            ) : null}

            <ProductActions
              actions={view.actions}
              showQuantity={view.showQuantity}
              quantity={quantity}
              onQuantityChange={changeQty}
              onAction={(actionId) => onAction?.(actionId, product, quantity)}
              layout={actionLayout}
            />

            {view.showSeller && product.seller ? (
              <div className="border-t border-gray-100 pt-4">
                <SellerCard
                  seller={product.seller}
                  variant={view.sellerVariant}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ProductTabs
        tabs={view.tabs}
        product={product}
        defaultTab={view.defaultTab}
      />
    </div>
  )
}
