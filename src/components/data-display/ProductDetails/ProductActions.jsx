import {
  FiCheck,
  FiShoppingCart,
  FiSlash,
} from 'react-icons/fi'
import QuantitySelector from './QuantitySelector'

const ICON_MAP = {
  cart: FiShoppingCart,
  check: FiCheck,
  ban: FiSlash,
}

function ActionButton({ action, onClick, className = '' }) {
  const Icon = action.icon ? ICON_MAP[action.icon] : null
  const base =
    'inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5'

  const variants = {
    primary:
      'bg-[var(--active)] text-white hover:brightness-95',
    outline:
      'border border-[var(--active)] bg-white text-[var(--active)] hover:bg-[color-mix(in_srgb,var(--active)_8%,white)]',
    danger:
      'bg-red-500 text-white hover:bg-red-600',
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(action.id)}
      className={`${base} ${variants[action.variant] || variants.primary} ${className}`}
    >
      {Icon ? <Icon className="size-4 shrink-0" /> : null}
      <span>{action.label}</span>
    </button>
  )
}

/**
 * Role-aware purchase / moderation actions.
 * customer: qty + add to cart + buy now
 * company: qty + add to cart, then buy now + send quote
 * admin: accept + reject
 */
export default function ProductActions({
  actions = [],
  showQuantity = false,
  quantity = 1,
  onQuantityChange,
  onAction,
  layout = 'customer',
}) {
  if (!actions.length && !showQuantity) return null

  if (layout === 'admin') {
    return (
      <div className="flex flex-row gap-3">
        {actions.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            onClick={onAction}
          />
        ))}
      </div>
    )
  }

  if (layout === 'company') {
    const [primary, ...rest] = actions
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {showQuantity ? (
            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              className="shrink-0"
            />
          ) : null}
          {primary ? (
            <ActionButton
              action={primary}
              onClick={onAction}
              className="min-w-0"
            />
          ) : null}
        </div>
        {rest.length ? (
          <div className="flex flex-row gap-3">
            {rest.map((action) => (
              <ActionButton key={action.id} action={action} onClick={onAction} />
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  // customer: qty + primary actions share one aligned row; wrap cleanly on narrow screens
  const [primary, ...rest] = actions
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {showQuantity ? (
          <QuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            className="shrink-0"
          />
        ) : null}
        {primary ? (
          <ActionButton
            action={primary}
            onClick={onAction}
            className="min-w-0"
          />
        ) : null}
        {rest.length === 1 ? (
          <ActionButton
            action={rest[0]}
            onClick={onAction}
            className="hidden min-w-0 sm:inline-flex"
          />
        ) : null}
      </div>
      {rest.length === 1 ? (
        <ActionButton
          action={rest[0]}
          onClick={onAction}
          className="w-full sm:hidden"
        />
      ) : rest.length > 1 ? (
        <div className="flex flex-row gap-3">
          {rest.map((action) => (
            <ActionButton key={action.id} action={action} onClick={onAction} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
