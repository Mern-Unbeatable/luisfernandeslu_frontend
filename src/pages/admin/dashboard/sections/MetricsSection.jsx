import { useTranslation } from 'react-i18next'
import StatusCard from '@/components/data-display/StatusCard'
import { getAdminMetricsForChannel } from '../data/dashboardDemo'

export default function MetricsSection({ channel = 'all', data, isLoading }) {
  const { t } = useTranslation()
  const metrics = getAdminMetricsForChannel(channel)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-6 w-28 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
      {metrics.map((metric) => {
        const metricData = data?.[metric.id]
        let displayValue = metric.value
        if (metricData) {
          if (typeof metricData === 'object') {
            displayValue = metricData[channel] ?? metricData.all ?? metric.value
          } else {
            displayValue = String(metricData)
          }
        }

        return (
          <StatusCard
            key={metric.id}
            variant="default"
            label={t(`adminDashboard.metrics.${metric.id}`)}
            value={displayValue}
            icon={metric.icon}
            iconTone={metric.iconTone}
          />
        )
      })}
    </div>
  )
}
