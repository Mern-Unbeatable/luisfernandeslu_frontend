import StatusCard from '@/components/data-display/StatusCard'
import RevenueOverview from './RevenueOverview'
import OrderStatus from './OrderStatus'

const REVENUE_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const REVENUE_SERIES = {
  'This year': [
    2000, 3700, 2100, 4500, 2800, 2850, 2900, 3600, 4800, 5500, 4200, 3800,
  ],
  'Last year': [
    1600, 2400, 2800, 3200, 3000, 3500, 4100, 3900, 4300, 4000, 3600, 3300,
  ],
}

const ORDER_STATUS_SERIES = {
  'This month': [
    { label: 'Completed', value: 1236, color: '#DF900A' },
    { label: 'In Production', value: 32, color: '#E85A8C' },
    { label: 'Pending', value: 16, color: '#84CC16' },
  ],
  'This week': [
    { label: 'Completed', value: 286, color: '#DF900A' },
    { label: 'In Production', value: 12, color: '#E85A8C' },
    { label: 'Pending', value: 8, color: '#84CC16' },
  ],
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          Welcome back! Here&apos;s what&apos;s happening with your factory
          today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatusCard label="Total Orders" value="1,284" />
        <StatusCard label="Pending Orders" value="48" />
        <StatusCard label="Completed Orders" value="1,236" />
        <StatusCard label="Total Revenue" value="$40,000,000" />
        <StatusCard
          label="Admin Comission"
          value="20%"
          description="20% per order"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueOverview
            title="Revenue Overview"
            subtitle="Monthly revenue for the last 6 months"
            labels={REVENUE_LABELS}
            series={REVENUE_SERIES}
            filterOptions={['This year', 'Last year']}
            defaultFilter="This year"
          />
        </div>

        <div className="xl:col-span-1">
          <OrderStatus
            title="Order Status"
            series={ORDER_STATUS_SERIES}
            filterOptions={['This month', 'This week']}
            defaultFilter="This month"
          />
        </div>
      </div>
    </div>
  )
}
