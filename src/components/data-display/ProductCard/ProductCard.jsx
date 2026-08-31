import { useState, useEffect } from 'react'
import {
  FiCheckCircle,
  FiEdit2,
  FiMessageSquare,
  FiStar,
  FiTrash2,
  FiXCircle,
} from 'react-icons/fi'
import { resolveActions } from './resolveActions'
import { resolveBadge } from './resolveBadge'

const ICON_MAP = {
  edit: FiEdit2,
  delete: FiTrash2,
  check: FiCheckCircle,
  x: FiXCircle,
  message: FiMessageSquare,
  star: FiStar,
}

/**
 * Prop-driven product card.
 * type + role + context + status + tag → layout / badge / actions
 */
export default function ProductCard({
  type = 'normal',
  role = 'none',
  context = 'listing',
  status = null,
  tag = null,
  badge,
  product = {},
  quantity: quantityProp,
  onQuantityChange,
  showQuantity = false,
  actions,
  onAction,
  onCardClick,
  className = '',
}) {
  const [qty, setQty] = useState(quantityProp ?? 1)

  const resolvedBadge = resolveBadge({
    type,
    status,
    tag,
    badge,
    context,
    product,
  })
  const resolvedActions = resolveActions({
    type,
    role,
    context,
    status,
    actions,
  })

  const isSponsored = type === 'sponsored'
  const isFeatured = type === 'featured'
  const isMarketplaceMeta = isSponsored

  const handleAction = (actionId) => {
    onAction?.(actionId, product)
  }

  const changeQty = (next) => {
    const value = Math.max(1, next)
    setQty(value)
    onQuantityChange?.(value)
  }

  return (
    <article
      onClick={() => onCardClick?.(product)}
      className={[
        'flex w-full flex-col overflow-hidden rounded-lg bg-white',
        isSponsored
          ? 'border-2 border-[var(--active)]'
          : 'border border-gray-200',
        onCardClick ? 'cursor-pointer' : '',
        'h-full',
        className,
      ].join(' ')}
    >
      <Media
        image={product.image}
        title={product.title}
        badge={resolvedBadge}
        badgePosition={isSponsored ? 'right' : 'left'}
        timeLeft={product.timeLeft}
      />

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        {product.title ? (
          <h3 className="text-[15px] font-bold text-[var(--primary-text)] leading-snug">
            {product.title}
          </h3>
        ) : null}

        {product.description ? (
          <p className="min-h-[2.5rem] text-[13px] text-[var(--secondary-text)] line-clamp-2">
            {product.description}
          </p>
        ) : (
          <p className="min-h-[2.5rem]" aria-hidden />
        )}

        {product.bulkOptionLabel ? (
          <p className="text-[13px] font-medium text-[#F64C00]">
            {product.bulkOptionLabel}
          </p>
        ) : null}

        <PriceBlock
          role={role}
          type={type}
          product={product}
          marketplaceMeta={isMarketplaceMeta}
        />

        {isFeatured && product.expiryDate && !product.timeLeft ? (
          <div className="mt-1">
            <p className="text-xs text-[var(--secondary-text)]">Expiry Date</p>
            <p className="text-sm font-medium text-[var(--primary-text)]">
              {product.expiryDate}
            </p>
          </div>
        ) : null}

        {isMarketplaceMeta ? (
          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[var(--secondary-text)]">
            <span>{product.company || '—'}</span>
            {product.rating != null ? (
              <span className="inline-flex items-center gap-1 font-medium text-[var(--primary-text)]">
                <span className="text-[var(--active)]" aria-hidden>
                  ★
                </span>
                {product.rating}
              </span>
            ) : null}
          </div>
        ) : null}

        {(showQuantity || product.showQuantity) && !isFeatured ? (
          <div className="mt-auto flex items-center gap-3 pt-2">
            <QuantityControl
              value={qty}
              onDecrease={() => changeQty(qty - 1)}
              onIncrease={() => changeQty(qty + 1)}
            />
            <ActionButton
              action={{
                id: 'add_to_cart',
                kind: 'pill',
                label: 'Add To Cart',
                variant: 'primary',
              }}
              className="flex-1"
              onClick={() => handleAction('add_to_cart')}
            />
          </div>
        ) : null}

        {!isFeatured && !isMarketplaceMeta && !(showQuantity || product.showQuantity) ? (
          <ActionFooter actions={resolvedActions} onAction={handleAction} />
        ) : null}

        {!isFeatured
        && !isMarketplaceMeta
        && (showQuantity || product.showQuantity)
        && resolvedActions.length > 0
        && !resolvedActions.some((a) => a.id === 'view_details')
          ? (
              <ActionFooter actions={resolvedActions} onAction={handleAction} />
            )
          : null}
      </div>
    </article>
  )
}

function Media({ image, title, badge, badgePosition = 'left', timeLeft }) {
  const [loadState, setLoadState] = useState(image ? 'loading' : 'empty')

  useEffect(() => {
    setLoadState(image ? 'loading' : 'empty')
  }, [image])

  const BadgeIcon = badge?.icon ? ICON_MAP[badge.icon] : null
  const showImage = Boolean(image) && loadState !== 'error'

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
      {loadState === 'loading' && showImage ? (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100"
          aria-hidden
        />
      ) : null}

      {showImage ? (
        <img
          src={image}
          alt={title || 'Product'}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoadState('loaded')}
          onError={() => setLoadState('error')}
          className={[
            'size-full object-cover transition-opacity duration-300',
            loadState === 'loaded' ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
      ) : (
        <div className="flex size-full items-center justify-center px-3 text-center text-xs text-gray-400">
          {title || 'No image'}
        </div>
      )}
      {badge ? (
        <span
          className={`absolute top-2.5 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${
            badgePosition === 'right' ? 'right-2.5' : 'left-2.5'
          } ${badge.className}`}
        >
          {BadgeIcon ? <BadgeIcon className="size-3" aria-hidden /> : null}
          {badge.label}
        </span>
      ) : null}
      {timeLeft ? (
        <span className="absolute right-2.5 bottom-2.5 rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white">
          {timeLeft}
        </span>
      ) : null}
    </div>
  )
}

function PriceBlock({ role, type, product, marketplaceMeta }) {
  const showCompanyPrice =
    role === 'company'
    && (product.companyPriceText || product.companyPrice)

  if (marketplaceMeta) {
    return (
      <div className="mt-1 flex flex-col gap-1">
        <div className="flex items-end justify-between gap-2">
          <p className="text-[var(--primary-text)]">
            <span className="text-base font-bold">{product.price ?? '—'}</span>
            {product.unit ? (
              <span className="ml-1 text-xs text-[var(--secondary-text)]">
                /{product.unit}
              </span>
            ) : null}
          </p>
          {product.minOrder ? (
            <p className="text-xs font-bold text-[var(--secondary-text)]">
              Min: {product.minOrder}
            </p>
          ) : null}
        </div>
        {showCompanyPrice ? (
          <p className="text-xs font-semibold text-[var(--active)]">
            {product.companyPriceText
              || `Company: ${product.companyPrice}${product.unit ? ` /${product.unit}` : ''}`}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="mt-0.5 flex flex-col gap-0.5">
      <p className="text-sm font-bold text-[var(--primary-text)]">
        {product.priceText
          || (product.price != null
            ? `Price: ${product.price}${product.unit ? ` per ${product.unit}` : ''}`
            : null)
          || '—'}
      </p>
      {showCompanyPrice
      && (type === 'normal' || type === 'marketing' || type === 'featured')
        ? (
            <p className="text-sm font-semibold text-[var(--active)]">
              {product.companyPriceText
                || `Company: ${product.companyPrice}${product.unit ? ` per ${product.unit}` : ''}`}
            </p>
          )
        : null}
    </div>
  )
}

function QuantityControl({ value, onDecrease, onIncrease }) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-gray-200">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onDecrease()
        }}
        className="flex size-8 items-center justify-center bg-[color-mix(in_srgb,var(--active)_12%,white)] text-base font-medium text-[var(--primary-text)]"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="flex size-8 items-center justify-center bg-[var(--active)] text-xs font-semibold text-white">
        {value}
      </span>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onIncrease()
        }}
        className="flex size-8 items-center justify-center bg-[color-mix(in_srgb,var(--active)_12%,white)] text-base font-medium text-[var(--primary-text)]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

function ActionFooter({ actions, onAction }) {
  if (!actions?.length) return null

  const icons = actions.filter((a) => a.kind === 'icon')
  const pills = actions.filter((a) => a.kind === 'pill')
  const fulls = actions.filter((a) => a.kind === 'full')

  if (fulls.length === 1 && icons.length === 0 && pills.length === 0) {
    return (
      <div className="mt-auto pt-2">
        <ActionButton
          action={fulls[0]}
          className="w-full"
          onClick={() => onAction(fulls[0].id)}
        />
      </div>
    )
  }

  if (icons.length && pills.length) {
    return (
      <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
        <div className="flex items-center gap-1.5">
          {icons.map((action) => (
            <ActionButton
              key={action.id}
              action={action}
              onClick={() => onAction(action.id)}
            />
          ))}
        </div>
        {pills.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            className="min-w-0 flex-1"
            onClick={() => onAction(action.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-auto flex w-full items-center gap-1.5 pt-2">
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          action={action}
          className={action.kind === 'icon' ? 'shrink-0' : 'min-w-0 flex-1'}
          onClick={() => onAction(action.id)}
        />
      ))}
    </div>
  )
}

function ActionButton({ action, onClick, className = '' }) {
  const Icon = action.icon ? ICON_MAP[action.icon] : null

  if (action.kind === 'icon') {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onClick?.()
        }}
        aria-label={action.label || action.id}
        className={`inline-flex size-8 items-center justify-center rounded-md border border-gray-300 text-[var(--primary-text)] transition-colors hover:bg-gray-50 ${className}`}
      >
        {Icon ? <Icon className="size-3.5" /> : null}
      </button>
    )
  }

  const variants = {
    primary: 'bg-[var(--active)] text-white hover:brightness-95',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    neutral: 'bg-gray-600 text-white hover:bg-gray-700',
    outline:
      'border border-gray-300 bg-white text-[var(--primary-text)] hover:bg-gray-50',
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      className={`flex w-full items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors ${action.kind === 'full' ? 'rounded-full' : 'rounded-md'} ${variants[action.variant] || variants.primary} ${className}`}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {action.label}
    </button>
  )
}

export { resolveActions, resolveBadge }
