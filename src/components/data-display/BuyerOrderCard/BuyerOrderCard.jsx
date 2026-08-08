import { useTranslation } from 'react-i18next'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'

const ACTIONS_BY_STATUS = {
  shipped: [
    {
      id: 'cancel',
      labelKey: 'buyerOrders.cancelOrder',
      variant: 'danger',
    },
    {
      id: 'track',
      labelKey: 'buyerOrders.trackOrder',
      variant: 'primary',
    },
  ],
  processing: [
    {
      id: 'cancel',
      labelKey: 'buyerOrders.cancelOrder',
      variant: 'danger',
    },
    {
      id: 'track',
      labelKey: 'buyerOrders.trackOrder',
      variant: 'primary',
    },
  ],
  delivered: [
    {
      id: 'review',
      labelKey: 'buyerOrders.writeReview',
      variant: 'danger',
    },
  ],
}

const BUTTON_VARIANTS = {
  primary: 'bg-[var(--active)] text-white hover:brightness-95',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

/**
 * Buyer account order row (customer / company dashboards).
 */
export default function BuyerOrderCard({
  order,
  onAction,
  className = '',
}) {
  const { t } = useTranslation()
  const actions = order.actions ?? ACTIONS_BY_STATUS[order.status] ?? []

  const statusLabel =
    order.statusLabel ?? t(`buyerOrders.status.${order.status}`, order.status)

  return (
    <article
      className={`flex w-full gap-4 rounded-lg bg-[#F3F4F6] p-4 sm:gap-6 sm:p-5 ${className}`}
    >
      <div className="size-24 shrink-0 overflow-hidden rounded-md bg-white sm:size-28">
        {order.image ? (
          <img
            src={order.image}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-[var(--secondary-text)]">
            —
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-xs text-[var(--secondary-text)] sm:text-sm">
            {t('buyerOrders.orderId', { id: order.id })}
          </p>
          <StatusBadge status={order.status} label={statusLabel} />
        </div>

        {order.title ? (
          <h2 className="mt-2 text-base font-bold text-[var(--primary-text)] sm:text-lg">
            {order.title}
          </h2>
        ) : null}

        {order.description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--secondary-text)] line-clamp-3">
            {order.description}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 sm:mt-auto sm:pt-4">
          {order.priceDisplay ? (
            <p className="text-base font-bold text-[var(--primary-text)] sm:text-lg">
              {order.priceDisplay}
            </p>
          ) : (
            <span />
          )}
          {actions.length ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => onAction?.(action.id, order)}
                  className={`inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-colors ${BUTTON_VARIANTS[action.variant] || BUTTON_VARIANTS.primary}`}
                >
                  {t(action.labelKey)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
