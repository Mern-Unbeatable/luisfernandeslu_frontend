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

const TIER_STATUS = {
  label: 'Active Tier Status',
  tierName: 'Starter Level',
  headline: 'You receive a 5% commission rate!',
  description:
    'Keep inviting customers to unlock higher tiers with even higher commission rates.',
  progressLabel: 'Progress to Bronze Level (10%)',
  currentClients: 12,
  targetClients: 100,
  helpText: 'You need 88 more active clients to reach Bronze Level.',
}

const EARNING_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const EARNING_SERIES = {
  'This year': [
    0, 250, 600, 900, 1500, 1700, 1600, 1000, 500, 400, 1400, 1500,
  ],
  'Last year': [
    120, 300, 480, 720, 980, 1250, 1180, 900, 650, 780, 1100, 1320,
  ],
}

export default function OverviewDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          Affiliate Earnings Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          Monitor performance and maximize earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatusCard
          variant="inline"
          label="Total Referred Client"
          value="13"
          icon={FiUser}
          iconTone="purple"
        />
        <StatusCard
          variant="inline"
          label="Active Client"
          value="12"
          icon={FiUserPlus}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label="Pending Commissions"
          value="$1010.00"
          icon={FiDollarSign}
          iconTone="brand"
        />
        <StatusCard
          variant="inline"
          label="Paid Commission"
          value="$355.00"
          icon={FiCreditCard}
          iconTone="gray"
        />
        <StatusCard
          variant="inline"
          label="Total Earnings"
          value="$1365.00"
          icon={FiTrendingUp}
          iconTone="purple"
        />
      </div>

      <ActiveTierStatus
        label={TIER_STATUS.label}
        tierName={TIER_STATUS.tierName}
        headline={TIER_STATUS.headline}
        description={TIER_STATUS.description}
        progressLabel={TIER_STATUS.progressLabel}
        currentClients={TIER_STATUS.currentClients}
        targetClients={TIER_STATUS.targetClients}
        helpText={TIER_STATUS.helpText}
      />

      <EarningAnalytics
        title="Earning Analytics"
        subtitle="Track earning"
        labels={EARNING_LABELS}
        series={EARNING_SERIES}
        filterOptions={['This year', 'Last year']}
        defaultFilter="This year"
      />
    </div>
  )
}
