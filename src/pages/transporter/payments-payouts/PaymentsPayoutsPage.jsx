import StatsSection from './sections/StatsSection'
import RevenueSection from './sections/RevenueSection'
import HistorySection from './sections/HistorySection'

export default function PaymentsPayoutsPage() {
  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Earnings & Wallet
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your income and manage payouts
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
