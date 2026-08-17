import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import StatsSection from './sections/StatsSection'
import ActionsSection from './sections/ActionsSection'
import RevenueSection from './sections/RevenueSection'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useSelector((state) => state.auth)
  const userName = user?.name || 'Atik Adnan'

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('transporterDashboard.title')}
        </h1>
        <p className="mt-1 text-base text-gray-500">
          {t('transporterDashboard.welcome', { name: userName })}
        </p>
      </div>

      {/* Row 1: Status Cards */}
      <StatsSection />

      {/* Row 2: Action Cards */}
      <ActionsSection />

      {/* Row 3: Revenue Overview Section */}
      <RevenueSection />
    </div>
  )
}
