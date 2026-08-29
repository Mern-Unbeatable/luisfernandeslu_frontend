import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  useGetAdminAffiliatePayoutRequestsQuery,
  useUpdateAdminAffiliatePayoutStatusMutation,
} from '@/features/admin/adminAffiliateApi'
import { mapAdminAffiliatePayoutRequest } from '@/features/admin/adminAffiliateMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import SupplierRowActionMenu from '../../supplier-management/components/SupplierRowActionMenu'
import PayoutStatusBadge from '../../finance-payments/components/PayoutStatusBadge'

const I18N_KEY = 'adminAffiliateDirectory'
const PAGE_SIZE = 7

export default function PayoutControlSection() {
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, debouncedSearch])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminAffiliatePayoutRequestsQuery({
    status: statusFilter,
    search: debouncedSearch,
    page,
    limit: PAGE_SIZE,
  })

  const [updatePayoutStatus] = useUpdateAdminAffiliatePayoutStatusMutation()

  const rows = useMemo(
    () => (data?.payouts ?? []).map(mapAdminAffiliatePayoutRequest),
    [data?.payouts],
  )

  const pagination = data?.pagination
  const total = pagination?.total ?? 0
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)
  const paginationFrom = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo =
    total === 0 ? 0 : Math.min(safePage * PAGE_SIZE, total)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const showInitialLoading = isLoading && !data

  const handlePayoutStatusChange = useCallback(
    async (row, status) => {
      try {
        const result = await updatePayoutStatus({
          payoutId: row.id,
          status,
        }).unwrap()

        if (result?.success === false) {
          toast.error(
            getAuthErrorMessage(result, t(`${I18N_KEY}.payoutControl.actionFailed`)),
          )
          return
        }

        toast.success(
          result?.message || t(`${I18N_KEY}.payoutControl.statusUpdated`),
        )
      } catch (err) {
        toast.error(
          getAuthErrorMessage(err, t(`${I18N_KEY}.payoutControl.actionFailed`)),
        )
      }
    },
    [updatePayoutStatus, t],
  )

  const menuActions = useMemo(
    () => [
      {
        id: 'paid',
        label: t(`${I18N_KEY}.payoutControl.actions.paid`),
        variant: 'primary',
        onClick: (row) => handlePayoutStatusChange(row, 'paid'),
      },
      {
        id: 'rejected',
        label: t(`${I18N_KEY}.payoutControl.actions.rejected`),
        variant: 'danger',
        onClick: (row) => handlePayoutStatusChange(row, 'rejected'),
      },
      {
        id: 'approved',
        label: t(`${I18N_KEY}.payoutControl.actions.approved`),
        onClick: (row) => handlePayoutStatusChange(row, 'approved'),
      },
    ],
    [handlePayoutStatusChange, t],
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

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>
            {getAuthErrorMessage(error, t(`${I18N_KEY}.payoutControl.loadFailed`))}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
      ) : null}

      <div className={isFetching && data ? 'opacity-60 transition-opacity' : ''}>
        <DataTable
          showSearch
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t(`${I18N_KEY}.payoutControl.searchPlaceholder`)}
          showFilters
          filterLabel={t(`${I18N_KEY}.sortLabel`)}
          filters={[
            {
              id: 'status',
              value: statusFilter,
              onChange: setStatusFilter,
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
          data={rows}
          loading={showInitialLoading}
          emptyMessage={t(`${I18N_KEY}.empty`)}
          showPagination
          pagination={{
            page: safePage,
            pageSize: PAGE_SIZE,
            total,
            from: paginationFrom,
            to: paginationTo,
            hasPrevious: safePage > 1,
            hasNext: safePage < totalPages,
            onPageChange: setPage,
            summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
              from: paginationFrom,
              to: paginationTo,
              total,
            }),
            previousLabel: t(`${I18N_KEY}.pagination.previous`),
            nextLabel: t(`${I18N_KEY}.pagination.next`),
          }}
        />
      </div>
    </div>
  )
}
