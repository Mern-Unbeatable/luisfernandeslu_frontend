import { useTranslation } from 'react-i18next'
import { FaGavel } from 'react-icons/fa'
import {
  FiTruck,
  FiCheckCircle,
  FiPackage,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'

export default function StatsSection({ stats = {} }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatusCard
        variant="default"
        label={t('transporterDashboard.cards.activeAuctions')}
        value={stats.activeAuctions || '—'}
        icon={FaGavel}
        iconTone="brand"
      />
      <StatusCard
        variant="default"
        label={t('transporterDashboard.cards.wonDeliveries')}
        value={stats.wonDeliveries || '—'}
        icon={FiCheckCircle}
        iconTone="teal"
      />
      <StatusCard
        variant="default"
        label={t('transporterDashboard.cards.inTransit')}
        value={stats.inTransit || '—'}
        icon={FiTruck}
        iconTone="warning"
      />
      <StatusCard
        variant="default"
        label={t('transporterDashboard.cards.completedToday')}
        value={stats.completedToday || '—'}
        icon={FiPackage}
        iconTone="purple"
      />
      <StatusCard
        variant="default"
        label={t('transporterDashboard.cards.todaysEarnings')}
        value={stats.todaysEarnings || '—'}
        icon={FiDollarSign}
        iconTone="teal"
      />
      <StatusCard
        variant="default"
        label={t('transporterDashboard.cards.pendingEarnings')}
        value={stats.pendingEarnings || '—'}
        icon={FiClock}
        iconTone="warning"
      />
    </div>
  )
}
