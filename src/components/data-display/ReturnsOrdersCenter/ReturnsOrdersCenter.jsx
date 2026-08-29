import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiChevronRight } from 'react-icons/fi'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'
import ReturnsCenterToolbar from './ReturnsCenterToolbar'

export default function ReturnsOrdersCenter({
  orders = [],
  returns = [],
  isFetching = false,
  className = '',
}) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'return' ? 'return' : 'orders'
  const [tab, setTab] = useState(initialTab)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setTab(searchParams.get('tab') === 'return' ? 'return' : 'orders')
  }, [searchParams])

  const handleTabChange = (next) => {
    setTab(next)
    if (next === 'return') {
      setSearchParams({ tab: 'return' }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (row) =>
        row.orderNumber?.toLowerCase().includes(q)
        || row.id?.toLowerCase().includes(q),
    )
  }, [orders, query])

  const filteredReturns = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return returns
    return returns.filter(
      (row) =>
        row.displayId?.toLowerCase().includes(q)
        || row.title?.toLowerCase().includes(q)
        || row.reason?.toLowerCase().includes(q),
    )
  }, [returns, query])

  return (
    <div
      className={[
        `mx-auto w-full max-w-4xl ${className}`,
        isFetching ? 'opacity-60' : '',
      ].join(' ')}
    >
      <ReturnsCenterToolbar
        tab={tab}
        onTabChange={handleTabChange}
        query={query}
        onQueryChange={setQuery}
      />

      {tab === 'return' ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <h2 className="border-b border-gray-100 px-4 py-4 text-base font-bold text-[var(--primary-text)] sm:px-5">
            {t('returnsCenter.myReturnsTitle')}
          </h2>
          {filteredReturns.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-[var(--secondary-text)] sm:px-5">
              {t('returnsCenter.returnsEmpty')}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredReturns.map((row) => (
                <li key={row.id}>
                  <Link
                    to={`/returns/request/${row.id}`}
                    className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-[#FAFAFA] sm:px-5"
                  >
                    <img
                      src={row.image}
                      alt=""
                      className="size-14 shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--primary-text)]">
                        {row.title}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
                        {t('returnsCenter.reasonInline', { reason: row.reason })}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge
                        status={row.status}
                        label={t(
                          `returnsCenter.returnStatus.${row.status}`,
                          row.status,
                        )}
                      />
                      <span className="text-xs text-[var(--secondary-text)]">
                        {t('returnsCenter.updatedOn', { date: row.updatedAt })}
                      </span>
                    </div>
                    <FiChevronRight
                      className="size-5 shrink-0 text-[var(--secondary-text)]"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="mt-6 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t('returnsCenter.ordersEmpty')}
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/returns/${order.id}`}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-[var(--active)]"
              >
                <div className="flex items-start justify-between gap-2 px-4 py-3 sm:px-5">
                  <div>
                    <p className="font-bold text-[var(--primary-text)]">
                      {t('returnsCenter.orderNumber', {
                        id: order.orderNumber,
                      })}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
                      {order.date}
                    </p>
                  </div>
                  <StatusBadge
                    status={order.status}
                    label={t(`returnsCenter.status.${order.status}`, order.status)}
                  />
                </div>
                <div className="flex gap-2 px-4 pb-3 sm:px-5">
                  {order.thumbnails?.map((src, index) => (
                    <img
                      key={`${order.id}-${index}`}
                      src={src}
                      alt=""
                      className="size-14 rounded-md object-cover"
                    />
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 bg-[#F9FAFB] px-4 py-3 text-sm sm:px-5">
                  <span className="text-[var(--secondary-text)]">
                    {t('returnsCenter.itemCount', { count: order.itemCount })}
                  </span>
                  <span className="font-semibold text-[var(--active)]">
                    {t('returnsCenter.viewDetails')}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
