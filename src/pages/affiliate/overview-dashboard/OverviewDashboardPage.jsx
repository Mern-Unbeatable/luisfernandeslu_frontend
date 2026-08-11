import { useTranslation } from 'react-i18next'
import {
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
  FiUser,
  FiUserPlus,
} from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'
import ActiveTierStatus from './ActiveTierStatus'
import EarningAnalytics from './EarningAnalytics'

const EARNING_SERIES = {
  thisYear: [0, 250, 600, 900, 1500, 1700, 1600, 1000, 500, 400, 1400, 1500],
  lastYear: [120, 300, 480, 720, 980, 1250, 1180, 900, 650, 780, 1100, 1320],
}

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

const CURRENT_CLIENTS = 12
const TARGET_CLIENTS = 100

export default function OverviewDashboardPage() {
  const { t } = useTranslation()

  const clientsNeeded = Math.max(TARGET_CLIENTS - CURRENT_CLIENTS, 0)
  const earningLabels = MONTH_KEYS.map((key) =>
    t(`affiliateOverview.months.${key}`),
  )

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
          value="13"
          icon={FiUser}
          iconTone="purple"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.activeClient')}
          value="12"
          icon={FiUserPlus}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.pendingCommissions')}
          value="€1010.00"
          icon={FiDollarSign}
          iconTone="brand"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.paidCommission')}
          value="€355.00"
          icon={FiCreditCard}
          iconTone="gray"
        />
        <StatusCard
          variant="inline"
          label={t('affiliateOverview.cards.totalEarnings')}
          value="€1365.00"
          icon={FiTrendingUp}
          iconTone="purple"
        />
      </div>

      <ActiveTierStatus
        label={t('affiliateOverview.tier.label')}
        tierName={t('affiliateOverview.tier.tierName')}
        headline={t('affiliateOverview.tier.headline')}
        description={t('affiliateOverview.tier.description')}
        progressLabel={t('affiliateOverview.tier.progressLabel')}
        clientsLabel={t('affiliateOverview.tier.clients', {
          current: CURRENT_CLIENTS,
          target: TARGET_CLIENTS,
        })}
        currentClients={CURRENT_CLIENTS}
        targetClients={TARGET_CLIENTS}
        helpText={t('affiliateOverview.tier.helpText', {
          count: clientsNeeded,
        })}
      />

      <EarningAnalytics
        title={t('affiliateOverview.earningAnalytics.title')}
        subtitle={t('affiliateOverview.earningAnalytics.subtitle')}
        filterAriaLabel={t('affiliateOverview.earningAnalytics.filterAria')}
        labels={earningLabels}
        series={EARNING_SERIES}
        filterOptions={[
          {
            value: 'thisYear',
            label: t('affiliateOverview.filters.thisYear'),
          },
          {
            value: 'lastYear',
            label: t('affiliateOverview.filters.lastYear'),
          },
        ]}
        defaultFilter="thisYear"
      />
    </div>
  )
}
