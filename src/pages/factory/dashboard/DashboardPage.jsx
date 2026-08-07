import StatusCard from '@/components/data-display/StatusCard'

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
    </div>
  )
}
