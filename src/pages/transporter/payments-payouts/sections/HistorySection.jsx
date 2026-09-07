import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'
import DataTable from '../../../../components/data-display/DataTable/DataTable'
import Pagination from '../../../../components/common/Pagination/Pagination'

function StatusBadge({ status, t }) {
  const value = String(status || 'pending').toLowerCase()
  const isApproved = value === 'approved' || value === 'completed'
  const isRejected = value === 'rejected'

  const className = isApproved
    ? 'bg-emerald-50 text-emerald-600'
    : isRejected
      ? 'bg-red-50 text-red-600'
      : 'bg-orange-50 text-orange-600'

  const Icon = isApproved ? FiCheckCircle : isRejected ? FiXCircle : FiClock

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      <Icon className="size-3" />
      {t(`transporterPaymentsPayouts.status.${value}`, {
        defaultValue: value,
      })}
    </span>
  )
}

export default function HistorySection({
  rows = [],
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      {
        key: 'date',
        header: t('transporterPaymentsPayouts.columns.date'),
        render: (value) => (
          <span className="flex items-center gap-2 font-medium text-zinc-500">
            <FiCalendar className="size-4 text-zinc-400" />
            {value}
          </span>
        ),
      },
      {
        key: 'title',
        header: t('transporterPaymentsPayouts.columns.transaction'),
        render: (value, row) => (
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-800">{value}</span>
            <span className="text-xs text-zinc-400">
              {t(`transporterPaymentsPayouts.types.${String(row.type).toLowerCase()}`, {
                defaultValue: row.type,
              })}
            </span>
          </div>
        ),
      },
      {
        key: 'orderId',
        header: t('transporterPaymentsPayouts.columns.orderId'),
        render: (value) => (
          <span className="font-medium text-zinc-500">{value}</span>
        ),
      },
      {
        key: 'status',
        header: t('transporterPaymentsPayouts.columns.status'),
        render: (value) => <StatusBadge status={value} t={t} />,
      },
      {
        key: 'amount',
        header: t('transporterPaymentsPayouts.columns.amount'),
        headerClassName: 'text-right',
        className: 'text-right',
        render: (value, row) => (
          <span
            className={`font-bold ${row.isIncome ? 'text-emerald-600' : 'text-red-500'}`}
          >
            {value}
          </span>
        ),
      },
    ],
    [t],
  )

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        {t('transporterPaymentsPayouts.historyTitle')}
      </h2>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No transactions found.</p>
      ) : (
        <DataTable showCard={false} columns={columns} data={rows} />
      )}

      {totalPages > 1 ? (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  )
}
