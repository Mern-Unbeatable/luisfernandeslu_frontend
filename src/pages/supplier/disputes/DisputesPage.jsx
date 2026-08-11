import { useCallback, useMemo, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  DEMO_SUPPLIER_DISPUTES,
  SUPPLIER_DISPUTES_PAGE_SIZE,
} from '@/data/demoData'
import DisputeStatusBadge from './DisputeStatusBadge'

const STATUS_FILTER_OPTIONS = ['all', 'pending', 'under_review', 'resolved']

const STATUS_ACTION_OPTIONS = ['under_review', 'resolved']

export default function DisputesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(DEMO_SUPPLIER_DISPUTES)

  const pageSize = SUPPLIER_DISPUTES_PAGE_SIZE

  const statusOptions = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((value) => ({
        value,
        label:
          value === 'all'
            ? t('supplierDisputesResolution.filters.allStatus')
            : t(`supplierDisputesResolution.status.${value}`),
      })),
    [t],
  )

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return rows
    return rows.filter((row) => row.status === statusFilter)
  }, [rows, statusFilter])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const getRowActions = useCallback(
    (row) => [
      {
        id: 'see-details',
        label: t('supplierDisputesResolution.actions.seeDetails'),
        variant: 'header',
        onClick: (item) => navigate(`/supplier/disputes/${item.id}`),
      },
      {
        id: 'status-heading',
        label: t('supplierDisputesResolution.actions.status'),
        variant: 'section',
      },
      ...STATUS_ACTION_OPTIONS.map((status) => ({
        id: `set-${status}`,
        label: t(`supplierDisputesResolution.status.${status}`),
        onClick: (item) => {
          setRows((prev) =>
            prev.map((entry) =>
              entry.id === item.id ? { ...entry, status } : entry,
            ),
          )
          // TODO: wire supplier dispute status API
        },
      })),
    ],
    [navigate, t],
  )

  const columns = useMemo(
    () => [
      {
        key: 'disputeId',
        header: t('supplierDisputesResolution.columns.disputeId'),
        render: (value) => (
          <span className="font-medium text-[var(--primary-text)]">{value}</span>
        ),
      },
      {
        key: 'orderId',
        header: t('supplierDisputesResolution.columns.orderId'),
        render: (value) => (
          <span className="text-[var(--secondary-text)]">{value}</span>
        ),
      },
      {
        key: 'customer',
        header: t('supplierDisputesResolution.columns.customer'),
      },
      {
        key: 'supplier',
        header: t('supplierDisputesResolution.columns.supplier'),
      },
      {
        key: 'issue',
        header: t('supplierDisputesResolution.columns.issue'),
      },
      {
        key: 'status',
        header: t('supplierDisputesResolution.columns.status'),
        render: (value) => (
          <DisputeStatusBadge
            status={value}
            label={t(`supplierDisputesResolution.status.${value}`)}
          />
        ),
      },
      {
        key: 'registered',
        header: t('supplierDisputesResolution.columns.registered'),
      },
    ],
    [t],
  )

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total)

  return (
    <>
      <Seo
        title={t('supplierDisputesResolution.title')}
        description={t('supplierDisputesResolution.subtitle')}
      />
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t('supplierDisputesResolution.title')}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('supplierDisputesResolution.subtitle')}
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <label className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium uppercase tracking-wide text-[var(--secondary-text)]">
              {t('supplierDisputesResolution.sortBy')}
            </span>
            <span className="relative inline-flex min-w-[160px] items-center">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setPage(1)
                }}
                className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
                aria-label={t('supplierDisputesResolution.filters.allStatus')}
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
            emptyMessage={t('supplierDisputesResolution.empty')}
            showActions
            getActions={getRowActions}
            actionHeader={t('supplierDisputesResolution.columns.action')}
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
              summaryLabel: t('supplierDisputesResolution.pagination.summary', {
                from,
                to,
                total,
              }),
              previousLabel: t('supplierDisputesResolution.pagination.previous'),
              nextLabel: t('supplierDisputesResolution.pagination.next'),
            }}
          />
        </div>
      </div>
    </>
  )
}
