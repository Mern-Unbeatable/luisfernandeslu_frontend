import { useCallback, useMemo, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  DEMO_SUPPLIER_RETURN_REQUESTS,
  SUPPLIER_RETURN_REQUESTS_PAGE_SIZE,
} from '@/data/demoData'
import ReturnStatusBadge from './ReturnStatusBadge'

const STATUS_FILTER_OPTIONS = [
  'all',
  'pending',
  'under_review',
  'approved',
  'rejected',
  'item_received',
  'inspection_progress',
  'inspection_pass',
  'inspection_rejected',
]

const STATUS_ACTION_OPTIONS = [
  'pending',
  'under_review',
  'approved',
  'rejected',
  'item_received',
  'inspection_progress',
  'inspection_pass',
  'inspection_rejected',
]

function getStatusLabel(status, t) {
  if (status === 'rejected') {
    return t('supplierReturnRequests.actionReject')
  }
  return t(`supplierReturnRequests.status.${status}`)
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-[var(--secondary-text)]">{label}</p>
      <p className="mt-4 text-3xl font-bold text-[var(--primary-text)]">{value}</p>
    </div>
  )
}

export default function ReturnRequestsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [returns, setReturns] = useState(
    DEMO_SUPPLIER_RETURN_REQUESTS.returns,
  )

  const { stats } = DEMO_SUPPLIER_RETURN_REQUESTS
  const pageSize = SUPPLIER_RETURN_REQUESTS_PAGE_SIZE

  const statusOptions = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((value) => ({
        value,
        label:
          value === 'all'
            ? t('supplierReturnRequests.filters.allStatus')
            : t(`supplierReturnRequests.status.${value}`),
      })),
    [t],
  )

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return returns
    return returns.filter((row) => row.status === statusFilter)
  }, [returns, statusFilter])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const getRowActions = useCallback(
    (row) => [
      {
        id: 'see-details',
        label: t('supplierReturnRequests.actionSeeDetails'),
        variant: 'header',
        onClick: (item) =>
          navigate(`/supplier/return-requests/${item.id}`),
      },
      ...STATUS_ACTION_OPTIONS.map((status) => ({
        id: `set-${status}`,
        label: getStatusLabel(status, t),
        onClick: (item) => {
          setReturns((prev) =>
            prev.map((entry) =>
              entry.id === item.id ? { ...entry, status } : entry,
            ),
          )
          // TODO: wire return request status API
        },
      })),
    ],
    [navigate, t],
  )

  const columns = useMemo(
    () => [
      {
        key: 'returnId',
        header: t('supplierReturnRequests.columns.returnId'),
        render: (value) => (
          <span className="font-medium text-[var(--primary-text)]">{value}</span>
        ),
      },
      {
        key: 'orderId',
        header: t('supplierReturnRequests.columns.orderId'),
        render: (value) => (
          <span className="text-[var(--secondary-text)]">{value}</span>
        ),
      },
      {
        key: 'customerName',
        header: t('supplierReturnRequests.columns.customer'),
        render: (_, row) => (
          <div className="min-w-0">
            <p className="font-bold text-[var(--primary-text)]">
              {row.customerName}
            </p>
            <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
              {row.customerEmail}
            </p>
          </div>
        ),
      },
      {
        key: 'productName',
        header: t('supplierReturnRequests.columns.products'),
      },
      {
        key: 'reason',
        header: t('supplierReturnRequests.columns.reason'),
      },
      {
        key: 'requestDate',
        header: t('supplierReturnRequests.columns.requestDate'),
      },
      {
        key: 'status',
        header: t('supplierReturnRequests.columns.status'),
        render: (value) => (
          <ReturnStatusBadge
            status={value}
            label={t(`supplierReturnRequests.status.${value}`)}
          />
        ),
      },
    ],
    [t],
  )

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total)

  return (
    <>
      <Seo title={t('supplierReturnRequests.title')} />
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t('supplierReturnRequests.title')}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('supplierReturnRequests.subtitle')}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t('supplierReturnRequests.stats.total')}
            value={stats.total}
          />
          <StatCard
            label={t('supplierReturnRequests.stats.pendingReview')}
            value={stats.pendingReview}
          />
          <StatCard
            label={t('supplierReturnRequests.stats.approved')}
            value={stats.approved}
          />
          <StatCard
            label={t('supplierReturnRequests.stats.rejected')}
            value={stats.rejected}
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-[var(--secondary-text)] uppercase tracking-wide">
              {t('supplierReturnRequests.sortBy')}
            </span>
            <span className="relative inline-flex min-w-[160px] items-center">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setPage(1)
                }}
                className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
                aria-label={t('supplierReturnRequests.filters.allStatus')}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown
                className="pointer-events-none absolute right-2.5 size-4 text-[var(--secondary-text)]"
                aria-hidden
              />
            </span>
          </label>

          <DataTable
            columns={columns}
            data={paged}
            getRowKey={(row) => row.id}
            showActions
            getActions={getRowActions}
            actionHeader={t('supplierReturnRequests.columns.action')}
            showPagination
            pagination={{
              page: safePage,
              pageSize,
              total,
              from,
              to,
              hasPrevious: safePage > 1,
              hasNext: safePage < pageCount,
              onPageChange: setPage,
              summaryLabel: t('supplierReturnRequests.showingResults', {
                from,
                to,
                total,
              }),
              previousLabel: t('supplierReturnRequests.previous'),
              nextLabel: t('supplierReturnRequests.next'),
            }}
          />
        </div>
      </div>
    </>
  )
}
