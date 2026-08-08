import { FiDollarSign } from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatusCard
        variant="filled"
        label="Total Earnings"
        value="$580K"
        description="All time"
        icon={FiDollarSign}
      />
      <StatusCard
        variant="summary"
        label="Admin Commission"
        value="20%"
        description="20% per order"
      />
      <StatusCard
        variant="summary"
        label="Available Balance"
        value="$36,800"
        description={
          <span className="text-[var(--active, #f59e0b)] font-semibold cursor-pointer hover:underline">
            Request payout &rarr;
          </span>
        }
      />
      <StatusCard
        variant="summary"
        label="Pending Earnings"
        value="$26,500"
      />
      <StatusCard
        variant="summary"
        label="Monthly Average"
        value="$97K"
      />
    </div>
  )
}
