import { useTranslation } from 'react-i18next'
import StatusCard from '@/components/data-display/StatusCard'
import { getAdminMetricsForChannel } from '../data/dashboardDemo'

export default function MetricsSection({ channel = 'all' }) {
  const { t } = useTranslation()
  const metrics = getAdminMetricsForChannel(channel)

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
