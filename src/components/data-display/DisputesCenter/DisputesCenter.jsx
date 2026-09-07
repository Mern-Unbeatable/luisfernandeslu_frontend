import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronDown, FiFilter, FiPlus, FiSearch } from 'react-icons/fi'
import {
  FiClock,
  FiDollarSign,
  FiUser,
} from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'
import DisputeListCard from './DisputeListCard'
import RaiseDisputeModal from './RaiseDisputeModal'

const STATUS_FILTERS = ['all', 'pending', 'under_review', 'resolved']

export default function DisputesCenter({
  stats,
  disputes = [],
  orderOptions = [],
  onOpenDispute,
  onCreateDispute,
  isSubmitting = false,
  isFetching = false,
  className = '',
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreateDispute = async (payload) => {
    await onCreateDispute?.(payload)
    setModalOpen(false)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return disputes.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (!q) return true
      return (
        row.displayId?.toLowerCase().includes(q)
        || row.orderId?.toLowerCase().includes(q)
        || row.title?.toLowerCase().includes(q)
        || row.highlight?.toLowerCase().includes(q)
      )
    })
  }, [disputes, query, statusFilter])

  return (
    <div
      className={[
        `mx-auto w-full max-w-6xl ${className}`,
        isFetching ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          variant="inline"
          label={t('disputesCenter.stats.total')}
          value={String(stats?.total ?? 0)}
          icon={FiUser}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label={t('disputesCenter.stats.pendingAction')}
          value={String(stats?.pendingAction ?? 0)}
          icon={FiUser}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label={t('disputesCenter.stats.underReview')}
          value={String(stats?.underReview ?? 0)}
          icon={FiClock}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label={t('disputesCenter.stats.resolved')}
          value={String(stats?.resolved ?? 0)}
          icon={FiDollarSign}
          iconTone="teal"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
        <label className="relative min-w-0 flex-1">
          <FiSearch
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('disputesCenter.searchPlaceholder')}
            className="h-11 w-full rounded-lg border border-gray-200 py-2 pr-3 pl-10 text-sm outline-none focus:border-[var(--active)]"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-[var(--secondary-text)]">
          <FiFilter className="size-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">{t('disputesCenter.statusFilter')}</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 min-w-[120px] rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
          >
            {STATUS_FILTERS.map((value) => (
              <option key={value} value={value}>
                {t(`disputesCenter.filter.${value}`)}
              </option>
            ))}
          </select>
          <FiChevronDown
            className="pointer-events-none -ml-7 size-4 text-[var(--secondary-text)] sm:hidden"
            aria-hidden
          />
        </label>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95"
        >
          {t('disputesCenter.newDispute')}
          <FiPlus className="size-4" strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      <h2 className="mt-8 text-lg font-bold text-[var(--primary-text)]">
        {t('disputesCenter.recentTitle', { count: filtered.length })}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {filtered.map((dispute) => (
          <DisputeListCard
            key={dispute.id}
            dispute={dispute}
            onSelect={onOpenDispute}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-[var(--secondary-text)]">
          {t('disputesCenter.empty')}
        </p>
      ) : null}

      <RaiseDisputeModal
        open={modalOpen}
        onClose={() => {
          if (!isSubmitting) setModalOpen(false)
        }}
        orderOptions={orderOptions}
        onSubmit={handleCreateDispute}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
