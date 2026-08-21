import { useTranslation } from 'react-i18next'
import { FiAward } from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'
import { useGetAffiliateLevelsQuery } from '@/features/affiliate/affiliateLevelsApi'

function tierRequirement(tier) {
  if (tier.minActiveClients == null) return ''
  if (Number(tier.minActiveClients) === 0) return 'ENTRY LEVEL TIER'
  return `${tier.minActiveClients}+ Active Clients Required`
}

export default function AffiliateLevelsPage() {
  const { t } = useTranslation()

  const { data, isLoading } = useGetAffiliateLevelsQuery()
  const status = data?.status
  const tiers = data?.tiers || []
  const nextTier = status?.nextTier
  const progressPercent = Math.min(
    100,
    Math.max(0, Number(status?.progressPercent) || 0),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('affiliateLevels.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('affiliateLevels.subtitle')}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-xl">
            <p className="text-xs font-semibold tracking-wide text-[var(--active)] uppercase">
              {t('affiliateLevels.gamifiedAchievements')}
            </p>
            <h2 className="mt-2 text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
              {t('affiliateLevels.tierStatusTitle')}
            </h2>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              {t('affiliateLevels.tierStatusDescription')}
            </p>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-[#00000024] bg-[#F8FAFC] p-4 lg:max-w-md">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-[var(--primary-text)]">
                {t('affiliateLevels.activeReferrals')}
              </span>
              <span className="font-semibold text-[var(--active)]">
                {isLoading
                  ? '—'
                  : t('affiliateLevels.clientsCount', {
                      count: status?.activeClients ?? 0,
                    })}
              </span>
            </div>

            <p className="mt-3 text-sm text-[var(--secondary-text)]">
              {nextTier?.name
                ? `Progress to ${nextTier.name}`
                : t('affiliateLevels.progressToBronze')}
            </p>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[var(--primary-text)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-[var(--secondary-text)] italic">
              {status?.helperText || '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tiers.map((tier) => {
          const isActive = Boolean(tier.isCurrent)

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border p-3 pb-2 transition-colors ${
                isActive
                  ? 'border-[var(--active)] bg-[#FFF8F0]'
                  : 'border-transparent bg-transparent'
              }`}
            >
              {isActive ? (
                <span className="absolute top-4 right-4 z-10 inline-flex rounded-full bg-[var(--active)] px-2.5 py-0.5 text-xs font-semibold text-white">
                  {t('affiliateLevels.active')}
                </span>
              ) : null}

              <p className="px-1 pr-16 text-base font-bold text-[var(--primary-text)]">
                {tier.name}
              </p>
              <p className="mt-0.5 px-1 text-xs text-[var(--secondary-text)]">
                {tierRequirement(tier)}
              </p>

              <div className="mt-3">
                <StatusCard
                  label={t('affiliateLevels.commissionSplit')}
                  value={`${tier.commissionPercent}%`}
                  description={
                    tier.description || t('affiliateLevels.commissionSplitDesc')
                  }
                  icon={FiAward}
                  iconTone="brand"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
