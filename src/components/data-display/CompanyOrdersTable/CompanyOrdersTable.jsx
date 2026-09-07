import { useTranslation } from 'react-i18next'
import { FiEye, FiFilter } from 'react-icons/fi'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'

const STATUS_FILTER_OPTIONS = [
  'all',
  'progress',
  'pending',
  'assign',
  'completed',
]

export default function CompanyOrdersTable({
  orders = [],
  statusFilter = 'all',
  onStatusFilterChange,
  onViewOrder,
  page = 1,
  pageSize = 10,
  total: totalProp,
  totalPages: totalPagesProp,
  serverPaginated = false,
  isFetching = false,
  onPageChange,
  className = '',
}) {
  const { t } = useTranslation()

  const filtered = serverPaginated
    ? orders
    : statusFilter === 'all'
      ? orders
      : orders.filter((row) => row.status === statusFilter)

  const total = serverPaginated ? (totalProp ?? 0) : filtered.length
  const totalPages = serverPaginated
    ? Math.max(1, totalPagesProp ?? 1)
    : Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const clientStart = (safePage - 1) * pageSize
  const visible = serverPaginated
    ? orders
    : filtered.slice(clientStart, clientStart + pageSize)
  const showingFrom = serverPaginated
    ? (total ? (safePage - 1) * pageSize + 1 : 0)
    : (total ? clientStart + 1 : 0)
  const showingTo = serverPaginated
    ? Math.min(safePage * pageSize, total)
    : Math.min(clientStart + pageSize, total)

  return (
    <div
      className={[
        `overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`,
        isFetching ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {t('buyer.orders')}
        </h2>
        <label className="inline-flex items-center gap-2 text-sm text-[var(--secondary-text)]">
          <FiFilter className="size-4 shrink-0" aria-hidden />
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange?.(event.target.value)}
            className="rounded-md border border-gray-200 bg-white py-2 pr-8 pl-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
          >
            {STATUS_FILTER_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`companyOrders.filter.${value}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#F3F4F6] text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
            <tr>
              <th className="px-4 py-3 sm:px-6">{t('companyOrders.colOrderId')}</th>
              <th className="px-4 py-3">{t('companyOrders.colProduct')}</th>
              <th className="px-4 py-3">{t('companyOrders.colProject')}</th>
              <th className="px-4 py-3">{t('companyOrders.colQuantity')}</th>
              <th className="px-4 py-3">{t('companyOrders.colStatus')}</th>
              <th className="px-4 py-3 text-right sm:px-6">
                {t('companyOrders.colAction')}
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="border-t border-gray-200">
                <td className="px-4 py-4 font-medium text-[var(--primary-text)] sm:px-6">
                  #{row.orderNumber ?? row.id}
                </td>
                <td className="px-4 py-4 text-[var(--primary-text)]">
                  {row.productName}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-[var(--primary-text)]">
                    {row.projectName}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
                    {row.projectAddress}
                  </p>
                </td>
                <td className="px-4 py-4 text-[var(--secondary-text)]">
                  {row.quantityLabel}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge
                    status={row.status}
                    label={t(`companyOrders.status.${row.status}`, row.status)}
                  />
                </td>
                <td className="px-4 py-4 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => onViewOrder?.(row)}
                    aria-label={t('companyOrders.viewOrder', {
                      id: row.orderNumber ?? row.id,
                    })}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-gray-200 text-[var(--primary-text)] hover:border-[var(--active)] hover:text-[var(--active)]"
                  >
                    <FiEye className="size-4" aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t('companyOrders.empty')}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-[var(--secondary-text)]">
          {t('companyOrders.showing', {
            from: showingFrom,
            to: showingTo,
            total,
          })}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange?.(safePage - 1)}
            className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('companyOrders.previous')}
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange?.(safePage + 1)}
            className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('companyOrders.next')}
          </button>
        </div>
      </div>
    </div>
  )
}
