import Skeleton from './Skeleton'
import { ADMIN_DASHBOARD_METRICS } from '@/pages/admin/dashboard/data/dashboardDemo'

/**
 * Single skeleton for admin/moderator dashboard — matches the real page layout
 * (header, channel tabs, metric grid, quick actions, charts, performance).
 * Used for both route Suspense and API loading to avoid two different loaders.
 */
export default function AdminDashboardSkeleton() {
  return (
    <div
      className="space-y-8"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <header className="space-y-2">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </header>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={`channel-tab-${index}`}
            className="h-10 w-28 rounded-full"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
        {ADMIN_DASHBOARD_METRICS.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`quick-action-${index}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-5 w-48 max-w-full" />
              <Skeleton className="mt-3 h-4 w-40 max-w-full" />
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`chart-${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            <Skeleton className="mt-6 h-72 w-full rounded-xl sm:h-80" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`performance-${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <Skeleton className="h-5 w-36" />
            <div className="mt-5 space-y-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
