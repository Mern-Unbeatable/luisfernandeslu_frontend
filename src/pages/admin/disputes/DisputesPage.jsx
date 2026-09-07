import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  useGetAdminDisputesQuery,
  useUpdateAdminDisputeStatusMutation,
} from '@/features/admin/adminDisputeApi'
import { mapAdminDispute } from '@/features/admin/adminDisputeMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import DisputeRowActionMenu from './components/DisputeRowActionMenu'
import DisputeStatusBadge from './components/DisputeStatusBadge'
import {
  filterDisputesBySearch,
  filterDisputesByStatus,
} from './data/disputesAdminDemo'

const I18N_KEY = 'adminDisputesResolution'
const PAGE_SIZE = 7

export default function DisputesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminDisputesQuery()

  const [updateDisputeStatus] = useUpdateAdminDisputeStatusMutation()

  const rows = useMemo(
    () => (data?.disputes ?? []).map(mapAdminDispute),
    [data?.disputes],
  )

  const filteredRows = useMemo(() => {
    const byStatus = filterDisputesByStatus(rows, statusFilter)
    return filterDisputesBySearch(byStatus, searchQuery)
  }, [rows, statusFilter, searchQuery])

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

  const showInitialLoading = isLoading && !data

  const handleStatusChange = useCallback(
    async (row, nextStatus) => {
      try {
        const result = await updateDisputeStatus({
          disputeId: row.id,
          status: nextStatus,
        }).unwrap()

        if (result?.success === false) {
          toast.error(
            getAuthErrorMessage(result, t(`${I18N_KEY}.statusUpdateFailed`)),
          )
          return
        }

        toast.success(result?.message || t(`${I18N_KEY}.statusUpdated`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.statusUpdateFailed`)))
      }
    },
    [updateDisputeStatus, t],
  )

  const columns = useMemo(
    () => [
      {
        key: 'disputeId',
        header: t(`${I18N_KEY}.columns.disputeId`),
      },
      {
        key: 'orderId',
        header: t(`${I18N_KEY}.columns.orderId`),
      },
      {
        key: 'customer',
        header: t(`${I18N_KEY}.columns.customer`),
      },
      {
        key: 'supplier',
        header: t(`${I18N_KEY}.columns.supplier`),
      },
      {
        key: 'issue',
        header: t(`${I18N_KEY}.columns.issue`),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.columns.status`),
        render: (value) => (
          <DisputeStatusBadge
            status={value}
            label={t(`${I18N_KEY}.status.${value}`)}
          />
        ),
      },
      {
        key: 'registered',
        header: t(`${I18N_KEY}.columns.registered`),
      },
      {
        key: 'action',
        header: t(`${I18N_KEY}.columns.action`),
        render: (_, row) => (
          <DisputeRowActionMenu
            row={row}
            labels={{
              seeDetails: t(`${I18N_KEY}.actions.seeDetails`),
              statusHeading: t(`${I18N_KEY}.actions.status`),
              underReview: t(`${I18N_KEY}.status.under_review`),
              resolved: t(`${I18N_KEY}.status.resolved`),
            }}
            onSeeDetails={(r) => navigate(`/admin/disputes/${r.id}`)}
            onStatusChange={handleStatusChange}
          />
        ),
      },
    ],
    [t, navigate, handleStatusChange],
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t(`${I18N_KEY}.title`)}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t(`${I18N_KEY}.title`)}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t(`${I18N_KEY}.subtitle`)}
        </p>
      </header>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
      ) : null}

      <div
        className={
          isFetching && data ? 'opacity-60 transition-opacity' : undefined
        }
      >
        <DataTable
          showSearch
          searchValue={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value)
            setPage(1)
          }}
          searchPlaceholder={t(`${I18N_KEY}.searchPlaceholder`)}
          showFilters
          filters={[
            {
              id: 'status',
              value: statusFilter,
              onChange: (value) => {
                setStatusFilter(value)
                setPage(1)
              },
              options: [
                { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
                { value: 'pending', label: t(`${I18N_KEY}.status.pending`) },
                {
                  value: 'under_review',
                  label: t(`${I18N_KEY}.status.under_review`),
                },
                { value: 'resolved', label: t(`${I18N_KEY}.status.resolved`) },
              ],
            },
          ]}
          columns={columns}
          data={pagedRows}
          loading={showInitialLoading}
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
    </div>
  )
}
