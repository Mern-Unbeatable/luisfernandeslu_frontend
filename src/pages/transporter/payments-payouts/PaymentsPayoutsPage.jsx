import { useTranslation } from 'react-i18next'
import StatsSection from './sections/StatsSection'
import RevenueSection from './sections/RevenueSection'
import HistorySection from './sections/HistorySection'

export default function PaymentsPayoutsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('transporterPaymentsPayouts.title')}
        </h1>
        <p className="mt-1 text-base text-gray-500">
          {t('transporterPaymentsPayouts.subtitle')}
        </p>
      </div>

      {/* Row 1: Status Cards */}
      <StatsSection />

      {/* Row 2: Revenue Overview Chart */}
      <RevenueSection />

      {/* Row 3: Transaction History Table */}
      <HistorySection />
    </div>
  )
}
