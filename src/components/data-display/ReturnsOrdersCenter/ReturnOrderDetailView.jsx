import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'

export default function ReturnOrderDetailView({
  order,
  onReturnRefund,
  toolbar = null,
  className = '',
}) {
  const { t } = useTranslation()
  if (!order) return null

  return (
    <div className={`mx-auto w-full max-w-4xl ${className}`}>
      {toolbar}

      <Link
        to="/returns"
        className="mt-5 inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t('returnsCenter.backToOrders')}
      </Link>

      <article className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-bold text-[var(--primary-text)]">
              {t('returnsCenter.orderNumber', { id: order.orderNumber })}
            </p>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t('returnsCenter.placedOn', { date: order.placedDate })}
            </p>
          </div>
          <StatusBadge
            status="processing"
            label={t(`returnsCenter.status.${order.status}`, order.status)}
          />
        </div>

        <ul className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="size-16 shrink-0 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold text-[var(--primary-text)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--secondary-text)]">
                    {t('returnsCenter.lineMeta', {
                      qty: item.quantity,
                      price: item.price,
                    })}
                  </p>
                </div>
              </div>
              {item.returnId ? (
                <Link
                  to={`/returns/request/${item.returnId}`}
                  className="text-sm font-semibold text-[var(--active)] hover:underline"
                >
                  {t('returnsCenter.viewReturnStatus')}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onReturnRefund?.(item)}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[var(--active)] px-5 text-xs font-bold tracking-wide text-white uppercase hover:brightness-95"
                >
                  {t('returnsCenter.returnRefund')}
                </button>
              )}
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}
