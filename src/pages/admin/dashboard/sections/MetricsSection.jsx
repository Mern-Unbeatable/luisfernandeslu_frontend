import { useTranslation } from 'react-i18next'
import StatusCard from '@/components/data-display/StatusCard'
import { getAdminMetricsForChannel } from '../data/dashboardDemo'

export default function MetricsSection({ channel = 'all', data }) {
  const { t } = useTranslation()
  const metrics = getAdminMetricsForChannel(channel)

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
