import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Seo from '@/components/common/Seo/Seo'
import Pagination from '@/components/common/Pagination/Pagination'
import DeliveryTimeline from '@/components/data-display/DeliveryTimeline'
import { useGetAdminLogisticsQuery } from '@/features/admin/adminLogisticsApi'
import {
  ADMIN_LOGISTICS_STATUS_FILTERS,
  mapAdminLogisticsDelivery,
} from '@/features/admin/adminLogisticsMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const I18N_KEY = 'adminDeliveryLogistics'
const PAGE_SIZE = 20

const STATUS_LABEL_KEYS = {
  assigned: 'status.assigned',
  picked_up: 'status.pickedUp',
  in_transit: 'status.inTransit',
  delivered: 'status.delivered',
}

export default function DeliveryLogisticsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
  } = useGetAdminLogisticsQuery({
    status: statusFilter,
    search: debouncedSearch,
    page,
    limit: PAGE_SIZE,
  })

  const items = useMemo(
    () => (data?.deliveries ?? []).map(mapAdminLogisticsDelivery),
    [data?.deliveries],
  )

  const paginationMeta = data?.pagination
  const total = paginationMeta?.total ?? 0
  const totalPages = Math.max(1, paginationMeta?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)
  const paginationFrom = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo = total === 0 ? 0 : Math.min(safePage * PAGE_SIZE, total)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const showInitialLoading = isLoading && !data

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t(`${I18N_KEY}.title`)}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
            {t(`${I18N_KEY}.title`)}
          </h1>
          <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
            {t(`${I18N_KEY}.subtitle`)}
          </p>
        </header>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:shrink-0">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t(`${I18N_KEY}.searchPlaceholder`)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)] sm:min-w-[240px]"
            aria-label={t(`${I18N_KEY}.searchPlaceholder`)}
          />

          <label className="flex items-center gap-2 text-sm font-medium text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.filterLabel`)}
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
              aria-label={t(`${I18N_KEY}.filterLabel`)}
            >
              {ADMIN_LOGISTICS_STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status === 'all'
                    ? t(`${I18N_KEY}.filters.allStatus`)
                    : t(`${I18N_KEY}.${STATUS_LABEL_KEYS[status]}`)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

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

      {showInitialLoading ? (
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.loading`)}
        </p>
      ) : null}

      {!showInitialLoading && !isError && items.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.empty`)}
        </p>
      ) : null}

      {!showInitialLoading && !isError && items.length > 0 ? (
        <div className={isFetching ? 'opacity-60 transition-opacity' : ''}>
          <DeliveryTimeline
            items={items}
            onSeeDetails={(item) =>
              navigate(`/admin/delivery-logistics/${item.id}`)
            }
          />

          {totalPages > 1 ? (
            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-[var(--secondary-text)]">
                {t(`${I18N_KEY}.pagination.summary`, {
                  from: paginationFrom,
                  to: paginationTo,
                  total,
                })}
              </p>
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
