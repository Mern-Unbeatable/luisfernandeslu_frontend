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

function ActionButton({ action, onClick, className = '', isLoading }) {
  const Icon = action.icon ? ICON_MAP[action.icon] : null
  const base =
    'inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5 disabled:opacity-50'

  const variants = {
    primary: 'bg-[var(--active)] text-white hover:brightness-95',
    outline:
      'border border-[var(--active)] bg-white text-[var(--active)] hover:bg-[color-mix(in_srgb,var(--active)_8%,white)]',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => onClick?.(action.id)}
      className={`${base} ${variants[action.variant] || variants.primary} ${className}`}
    >
      {isLoading ? (
        <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      ) : Icon ? (
        <Icon className="size-4 shrink-0" aria-hidden />
      ) : null}
      <span>{action.label}</span>
    </button>
  )
}

/**
 * Role-aware purchase / moderation actions.
 *
 * customer: row1 = qty + ADD TO CART, row2 = BUY NOW
 * company:  row1 = qty + ADD TO CART, row2 = BUY NOW + SEND QUOTE
 * admin:    Accept + Reject in one row
 */
export default function ProductActions({
  actions = [],
  showQuantity = false,
  quantity = 1,
  onQuantityChange,
  onAction,
  layout = 'customer',
  loadingAction,
}) {
  if (!actions.length && !showQuantity) return null

  if (layout === 'admin') {
    return (
      <div className="flex flex-row gap-3">
        {actions.map((action) => (
          <ActionButton key={action.id} action={action} isLoading={loadingAction === action.id} onClick={onAction} />
        ))}
      </div>
    )
  }

  // customer + company share the same structure (matches mobile mockups)
  const [primary, ...rest] = actions

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-3">
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
            isLoading={loadingAction === primary.id}
            onClick={onAction}
            className="min-w-0"
          />
        ) : null}
      </div>

      {rest.length > 0 ? (
        <div className="flex flex-row gap-3">
          {rest.map((action) => (
            <ActionButton
              key={action.id}
              action={action}
              isLoading={loadingAction === action.id}
              onClick={onAction}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
