import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import AuctionCard from '@/components/data-display/AuctionCard'
import {
  ADMIN_AUCTIONS,
  ADMIN_AUCTION_FILTER_OPTIONS,
  countActiveAdminAuctions,
  filterAndSortAdminAuctions,
} from './data/auctionsAdminDemo'

const I18N_KEY = 'adminAuction'

export default function AuctionPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [boardDate, setBoardDate] = useState('2026-06-12')
  const [auctions] = useState(ADMIN_AUCTIONS)

  const activeCount = useMemo(
    () => countActiveAdminAuctions(auctions),
    [auctions],
  )

  const filteredAuctions = useMemo(
    () => filterAndSortAdminAuctions(auctions, filter),
    [auctions, filter],
  )

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
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--secondary-text)]">
            <span className="sr-only">{t(`${I18N_KEY}.dateLabel`)}</span>
            <input
              type="date"
              value={boardDate}
              onChange={(e) => setBoardDate(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
              aria-label={t(`${I18N_KEY}.dateLabel`)}
            />
          </label>
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.empty`)}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 lg:gap-4">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} role="admin" auction={auction} />
          ))}
        </div>
      )}
    </div>
  )
}
