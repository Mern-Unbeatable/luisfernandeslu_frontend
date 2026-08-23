import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
  FiUser,
  FiUserPlus,
} from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'
import { useGetAffiliateOverviewQuery } from '@/features/affiliate/affiliateOverviewApi'
import ActiveTierStatus from './ActiveTierStatus'
import EarningAnalytics from './EarningAnalytics'

const CURRENT_YEAR = new Date().getFullYear()

function formatEuro(value) {
  if (value == null || value === '') return '—'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return `€${amount.toFixed(2)}`
}

export default function OverviewDashboardPage() {
  const { t } = useTranslation()
  const [year, setYear] = useState(CURRENT_YEAR)

  const { data, isLoading } = useGetAffiliateOverviewQuery({ year })
  const overview = data?.overview
  const stats = overview?.stats
  const tier = overview?.tier
  const earningAnalytics = overview?.earningAnalytics
  const points = earningAnalytics?.points || []

  const currentTier = tier?.currentTier
  const nextTier = tier?.nextTier

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('affiliateOverview.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('affiliateOverview.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.totalReferredClient')}
          value={isLoading ? '—' : (stats?.totalReferredClients ?? '—')}
          icon={FiUser}
          iconTone="purple"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.activeClient')}
          value={isLoading ? '—' : (stats?.activeClients ?? '—')}
          icon={FiUserPlus}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.pendingCommissions')}
          value={isLoading ? '—' : formatEuro(stats?.pendingCommissions)}
          icon={FiDollarSign}
          iconTone="brand"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.paidCommission')}
          value={isLoading ? '—' : formatEuro(stats?.paidCommission)}
          icon={FiCreditCard}
          iconTone="gray"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.totalEarnings')}
          value={isLoading ? '—' : formatEuro(stats?.totalEarnings)}
          icon={FiTrendingUp}
          iconTone="purple"
        />
      </div>

      <ActiveTierStatus
        label={t('affiliateOverview.tier.label')}
        tierName={currentTier?.name || '—'}
        headline={
          currentTier?.commissionPercent != null
            ? `You receive a ${currentTier.commissionPercent}% commission rate!`
            : '—'
        }
        description={t('affiliateOverview.tier.description')}
        progressLabel={
          nextTier
            ? `Progress to ${nextTier.name} (${nextTier.commissionPercent}%)`
            : t('affiliateOverview.tier.progressLabel')
        }
        clientsLabel={
          tier
            ? `${tier.progressCurrent}/${tier.progressTarget} Clients`
            : undefined
        }
        currentClients={tier?.progressCurrent ?? 0}
        targetClients={tier?.progressTarget ?? 0}
        progressPercent={tier?.progressPercent}
        helpText={tier?.helperText}
      />

      <EarningAnalytics
        title={t('affiliateOverview.earningAnalytics.title')}
        subtitle={t('affiliateOverview.earningAnalytics.subtitle')}
        filterAriaLabel={t('affiliateOverview.earningAnalytics.filterAria')}
        labels={points.map((point) => point.month)}
        values={points.map((point) => point.amount)}
        filterOptions={[
          {
            value: String(CURRENT_YEAR),
            label: t('affiliateOverview.filters.thisYear'),
          },
          {
            value: String(CURRENT_YEAR - 1),
            label: t('affiliateOverview.filters.lastYear'),
          },
        ]}
        filter={String(year)}
        onFilterChange={(nextYear) => setYear(Number(nextYear))}
      />
    </div>
  )
}
