import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '@/components/data-display/DataTable/DataTable'
import SupplierRowActionMenu from '../../supplier-management/components/SupplierRowActionMenu'
import PayoutStatusBadge from '../../finance-payments/components/PayoutStatusBadge'
import {
  ADMIN_PAYOUT_REQUESTS,
  filterPayoutRequestsByStatus,
} from '../data/affiliatesAdminDemo'

const I18N_KEY = 'adminAffiliateDirectory'
const PAGE_SIZE = 7

export default function PayoutControlSection() {
  const { t } = useTranslation()
  const [rows, setRows] = useState(ADMIN_PAYOUT_REQUESTS)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => filterPayoutRequestsByStatus(rows, statusFilter),
    [rows, statusFilter],
  )

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pagedRows = useMemo(
    () =>
      filteredRows.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
      ),
    [filteredRows, safePage],
  )

  const paginationFrom =
    filteredRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo = Math.min(safePage * PAGE_SIZE, filteredRows.length)

  const menuActions = useMemo(
    () => [
      {
        id: 'paid',
        label: t(`${I18N_KEY}.payoutControl.actions.paid`),
        variant: 'primary',
        onClick: (row) => {
          setRows((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: 'paid' } : item,
            ),
          )
        },
      },
      {
        id: 'rejected',
        label: t(`${I18N_KEY}.payoutControl.actions.rejected`),
        variant: 'danger',
        onClick: (row) => {
          setRows((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: 'rejected' } : item,
            ),
          )
        },
      },
      {
        id: 'approved',
        label: t(`${I18N_KEY}.payoutControl.actions.approved`),
        onClick: (row) => {
          setRows((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: 'approved' } : item,
            ),
          )
        },
      },
    ],
    [t],
  )

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: t(`${I18N_KEY}.payoutControl.columns.affiliate`),
        render: (_, row) => (
          <div className="min-w-[10rem]">
            <p className="font-medium text-[var(--primary-text)]">{row.name}</p>
            <p className="text-xs text-[var(--secondary-text)]">{row.email}</p>
          </div>
        ),
      },
      {
        key: 'totalEarnings',
        header: t(`${I18N_KEY}.payoutControl.columns.totalEarnings`),
      },
      {
        key: 'requested',
        header: t(`${I18N_KEY}.payoutControl.columns.requested`),
      },
      {
        key: 'pending',
        header: t(`${I18N_KEY}.payoutControl.columns.pending`),
        render: (value) => (
          <span className="font-semibold text-[var(--active)]">{value}</span>
        ),
      },
      {
        key: 'accountNumber',
        header: t(`${I18N_KEY}.payoutControl.columns.accountNumber`),
      },
      {
        key: 'requestDate',
        header: t(`${I18N_KEY}.payoutControl.columns.requestDate`),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.payoutControl.columns.status`),
        render: (value) => (
          <PayoutStatusBadge
            status={value}
            label={t(`${I18N_KEY}.payoutStatus.${value}`)}
          />
        ),
      },
      {
        key: 'action',
        header: t(`${I18N_KEY}.columns.action`),
        render: (_, row) => (
          <SupplierRowActionMenu row={row} actions={menuActions} />
        ),
      },
    ],
    [t, menuActions],
  )

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-[var(--primary-text)] sm:text-lg">
        {t(`${I18N_KEY}.payoutControl.requestsTitle`)}
      </h2>
      <DataTable
        showFilters
        filterLabel={t(`${I18N_KEY}.sortLabel`)}
        filters={[
          {
            id: 'status',
            value: statusFilter,
            onChange: (value) => {
              setStatusFilter(value)
              setPage(1)
            },
            options: [
              {
                value: 'all',
                label: t(`${I18N_KEY}.payoutControl.filters.allRequests`),
              },
              {
                value: 'pending',
                label: t(`${I18N_KEY}.payoutStatus.pending`),
              },
              {
                value: 'approved',
                label: t(`${I18N_KEY}.payoutStatus.approved`),
              },
              {
                value: 'paid',
                label: t(`${I18N_KEY}.payoutStatus.paid`),
              },
              {
                value: 'rejected',
                label: t(`${I18N_KEY}.payoutStatus.rejected`),
              },
            ],
          },
        ]}
        columns={columns}
        data={pagedRows}
        emptyMessage={t(`${I18N_KEY}.empty`)}
        showPagination
        pagination={{
          page: safePage,
          pageSize: PAGE_SIZE,
          total: filteredRows.length,
          from: paginationFrom,
          to: paginationTo,
          hasPrevious: safePage > 1,
          hasNext: safePage < pageCount,
          onPageChange: setPage,
          summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
            from: paginationFrom,
            to: paginationTo,
            total: filteredRows.length,
          }),
          previousLabel: t(`${I18N_KEY}.pagination.previous`),
          nextLabel: t(`${I18N_KEY}.pagination.next`),
        }}
      />
    </div>
  )
}
