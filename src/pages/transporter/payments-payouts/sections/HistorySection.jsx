import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi'
import DataTable from '../../../../components/data-display/DataTable/DataTable'

const TRANSACTIONS = [
  {
    id: 1,
    date: '6/1/2026',
    title: 'Portland Cement - 500 bags',
    type: 'delivery',
    orderId: 'ORD-2847-015',
    status: 'completed',
    amount: '+€8,500',
    isIncome: true,
  },
  {
    id: 2,
    date: '5/31/2026',
    title: 'TMT Rods - 200 pieces',
    type: 'delivery',
    orderId: 'ORD-2847-014',
    status: 'pending',
    amount: '+€12,000',
    isIncome: true,
  },
  {
    id: 3,
    date: '5/30/2026',
    title: 'Bank Transfer to HDFC ***4521',
    type: 'payout',
    orderId: 'PAYOUT-842',
    status: 'completed',
    amount: '-€45,000',
    isIncome: false,
  },
  {
    id: 4,
    date: '5/30/2026',
    title: 'Red Bricks - 10,000 pieces',
    type: 'delivery',
    orderId: 'ORD-2847-013',
    status: 'completed',
    amount: '+€6,200',
    isIncome: true,
  },
  {
    id: 5,
    date: '5/29/2026',
    title: 'Ready Mix Concrete - 6m³',
    type: 'delivery',
    orderId: 'ORD-2847-012',
    status: 'completed',
    amount: '+€15,500',
    isIncome: true,
  },
  {
    id: 6,
    date: '5/29/2026',
    title: 'River Sand - 15 tons',
    type: 'delivery',
    orderId: 'ORD-2847-011',
    status: 'pending',
    amount: '+€7,800',
    isIncome: true,
  },
]

export default function HistorySection() {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      {
        key: 'date',
        header: t('transporterPaymentsPayouts.columns.date'),
        render: (value) => (
          <span className="flex items-center gap-2 text-zinc-500 font-medium">
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
        render: (value) => {
          const isCompleted = value === 'completed'
          return (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-orange-50 text-orange-600'
              }`}
            >
              {isCompleted ? (
                <FiCheckCircle className="size-3" />
              ) : (
                <FiClock className="size-3" />
              )}
              {t(`transporterPaymentsPayouts.status.${value}`, {
                defaultValue: value,
              })}
            </span>
          )
        },
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
      <DataTable showCard={false} columns={columns} data={TRANSACTIONS} />
    </div>
  )
}
