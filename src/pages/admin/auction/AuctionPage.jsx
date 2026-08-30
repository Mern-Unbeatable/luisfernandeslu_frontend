import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import Pagination from '@/components/common/Pagination/Pagination'
import AuctionCard from '@/components/data-display/AuctionCard'
import { useGetAdminAuctionsQuery } from '@/features/admin/adminAuctionApi'
import {
  countActiveAdminAuctions,
  getAdminApiFilterParam,
  mapAdminAuction,
} from '@/features/admin/adminAuctionMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { ADMIN_AUCTION_FILTER_OPTIONS } from './data/auctionsAdminDemo'

const PAGE_SIZE = 20
const I18N_KEY = 'adminAuction'

export default function AuctionPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [filter])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminAuctionsQuery({
    page,
    limit: PAGE_SIZE,
    filter: getAdminApiFilterParam(filter),
  })

  const auctions = useMemo(() => {
    void now
    return (data?.auctions ?? []).map(mapAdminAuction)
  }, [data?.auctions, now])

  const activeCount = useMemo(
    () => countActiveAdminAuctions(auctions),
    [auctions],
  )

  const paginationMeta = data?.pagination
  const total = paginationMeta?.total ?? 0
  const totalPages = Math.max(1, paginationMeta?.totalPages ?? 1)
  const paginationFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const paginationTo = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total)

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
        description={t(`${I18N_KEY}.subtitle`, { count: activeCount })}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
            {t(`${I18N_KEY}.title`)}
          </h1>
          <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
            {t(`${I18N_KEY}.subtitle`, { count: activeCount })}
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3 self-start lg:shrink-0">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.filterLabel`)}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
              aria-label={t(`${I18N_KEY}.filterLabel`)}
            >
              {ADMIN_AUCTION_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
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

      {!showInitialLoading && !isError && auctions.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.empty`)}
        </p>
      ) : null}

      {!showInitialLoading && !isError && auctions.length > 0 ? (
        <>
          <div
            className={`grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 lg:gap-4 ${isFetching ? 'opacity-60' : ''}`}
          >
            {auctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                role="admin"
                auction={auction}
                className="h-full"
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="space-y-3">
              <p className="text-center text-sm text-[var(--secondary-text)]">
                {t(`${I18N_KEY}.pagination.summary`, {
                  from: paginationFrom,
                  to: paginationTo,
                  total,
                })}
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
