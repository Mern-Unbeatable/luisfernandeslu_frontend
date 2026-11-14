import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import { useGetAdminTransportPaymentsQuery } from '@/features/admin/adminTransportPaymentApi'
import PayoutStatusBadge from '../components/PayoutStatusBadge'
import { formatFinanceCurrency } from '../data/financeDemo'

const I18N_KEY = 'adminFinancePayments.transportPayments'
const PAGE_SIZE = 7
const STATUS_FILTERS = ['all', 'pending', 'paid', 'failed', 'cancelled']

function formatDate(value) {
  return value ? String(value).slice(0, 10) : '—'
}

export default function TransportPaymentsSection() {
  const { t } = useTranslation()
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data } = useGetAdminTransportPaymentsQuery({
    page,
    limit: PAGE_SIZE,
    status,
    ...(search.trim() ? { search: search.trim() } : {}),
  })

  const rows = data?.payments || []
  const summary = data?.summary
  const total = data?.pagination?.total || 0
  const pageCount = Math.max(1, data?.pagination?.totalPages || 1)
  const safePage = Math.min(page, pageCount)
  const from = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, total)

  const columns = useMemo(
    () => [
      {
        key: 'paymentNumber',
        header: t(`${I18N_KEY}.columns.payment`),
        render: (value, row) => (
          <div className="min-w-0">
            <p className="font-semibold text-[var(--primary-text)]">{row.orderNumber}</p>
            <p className="text-xs text-[#6B7280]">{value}</p>
          </div>
        ),
      },
      {
        key: 'factory',
        header: t(`${I18N_KEY}.columns.parties`),
        render: (value, row) => (
          <div className="min-w-0">
            <p className="text-[var(--primary-text)]">{value}</p>
            <p className="text-xs text-[#6B7280]">→ {row.supplier}</p>
          </div>
        ),
      },
      {
        key: 'vehicleType',
        header: t(`${I18N_KEY}.columns.transport`),
        render: (value, row) => (
          <div className="min-w-0">
            <p className="text-[var(--primary-text)]">
              {t(`factoryOrders.transport.vehicles.${value}`, { defaultValue: value })}
            </p>
            <p className="text-xs text-[#6B7280]">{row.distanceKm} km</p>
          </div>
        ),
      },
      {
        key: 'amount',
        header: t(`${I18N_KEY}.columns.amount`),
        render: (value, row) => (
          <div className="min-w-0">
            <p className="font-medium text-[var(--active)]">{formatFinanceCurrency(value)}</p>
            <p className="text-xs text-[#6B7280]">{formatDate(row.paidAt || row.createdAt)}</p>
          </div>
        ),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.columns.status`),
        render: (value) => (
          <PayoutStatusBadge status={value} label={t(`${I18N_KEY}.status.${value}`)} />
        ),
      },
      {
        key: 'auction',
        header: t(`${I18N_KEY}.columns.auction`),
        render: (auction, row) => {
          if (!auction) {
            return (
              <span className="text-xs text-[#6B7280]">
                {t(`${I18N_KEY}.auctionStatus.notOpened`)}
              </span>
            )
          }
          return (
            <div className="min-w-0">
              <p className="text-[var(--primary-text)]">
                {auction.code ? `${auction.code} · ` : ''}
                {t(`${I18N_KEY}.auctionStatus.${auction.status}`, { defaultValue: auction.status })}
              </p>
              <p className="text-xs text-[#6B7280]">
                {auction.winner
                  ? t(`${I18N_KEY}.wonBy`, {
                      name: auction.winner,
                      amount: formatFinanceCurrency(row.transporterCost),
                    })
                  : t(`${I18N_KEY}.bids`, { count: auction.bids })}
              </p>
            </div>
          )
        },
      },
      {
        key: 'margin',
        header: t(`${I18N_KEY}.columns.margin`),
        render: (value) =>
          value == null ? (
            <span className="text-[#6B7280]">—</span>
          ) : (
            <span className={`font-bold ${value < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
              {formatFinanceCurrency(value)}
            </span>
          ),
      },
    ],
    [t],
  )

  const statCards = [
    { label: t(`${I18N_KEY}.stats.paid`), value: formatFinanceCurrency(summary?.paidTotal || 0) },
    { label: t(`${I18N_KEY}.stats.pending`), value: formatFinanceCurrency(summary?.pendingTotal || 0) },
    { label: t(`${I18N_KEY}.stats.failed`), value: String(summary?.failedCount || 0) },
    {
      label: t(`${I18N_KEY}.stats.margin`),
      value: formatFinanceCurrency(summary?.margin || 0),
      description: t(`${I18N_KEY}.marginHint`, {
        paid: formatFinanceCurrency(summary?.assignedPaidTotal || 0),
        cost: formatFinanceCurrency(summary?.transporterCost || 0),
      }),
    },
  ]

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--primary-text)]">{t(`${I18N_KEY}.title`)}</h2>
        <p className="mt-1 text-sm text-[#6B7280]">{t(`${I18N_KEY}.subtitle`)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {statCards.map((card) => (
          <StatusCard
            key={card.label}
            variant="default"
            label={card.label}
            value={card.value}
            description={card.description}
          />
        ))}
      </div>

      <DataTable
        showSearch
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        searchPlaceholder={t(`${I18N_KEY}.searchPlaceholder`)}
        showFilters
        filters={[
          {
            id: 'status',
            value: status,
            onChange: (value) => {
              setStatus(value)
              setPage(1)
            },
            options: STATUS_FILTERS.map((value) => ({
              value,
              label: t(`${I18N_KEY}.status.${value}`),
            })),
          },
        ]}
        columns={columns}
        data={rows}
        emptyMessage={t(`${I18N_KEY}.empty`)}
        showPagination
        pagination={{
          page: safePage,
          pageSize: PAGE_SIZE,
          total,
          from,
          to,
          hasPrevious: safePage > 1,
          hasNext: safePage < pageCount,
          onPageChange: setPage,
          summaryLabel: t('adminFinancePayments.pagination.summary', { from, to, total }),
          previousLabel: t('adminFinancePayments.pagination.previous'),
          nextLabel: t('adminFinancePayments.pagination.next'),
        }}
      />
    </section>
  )
}
