import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import StatusCard from '@/components/data-display/StatusCard'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import { getAdminMetricsForChannel } from '../data/dashboardDemo'

export default function MetricsSection({ channel = 'all', data, isLoading }) {
  const { t } = useTranslation()
  const fallbackMetrics = useMemo(() => getAdminMetricsForChannel(channel), [channel])

  const metrics = useMemo(() => {
    return fallbackMetrics.map((metric) => {
      const apiItem = data?.[metric.id]
      if (apiItem) {
        const val = typeof apiItem === 'object' ? apiItem[channel] || apiItem.all : apiItem
        if (val != null) {
          return { ...metric, value: val }
        }
      }
      return metric
    })
  }, [fallbackMetrics, data, channel])

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={`metric-skel-${idx}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
      {metrics.map((metric) => (
        <StatusCard
          key={metric.id}
          variant="default"
          label={t(`adminDashboard.metrics.${metric.id}`)}
          value={metric.value}
          icon={metric.icon}
          iconTone={metric.iconTone}
        />
      ))}
    </div>
  )
}
