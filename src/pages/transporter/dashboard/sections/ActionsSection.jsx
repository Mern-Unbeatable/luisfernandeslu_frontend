import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaGavel } from 'react-icons/fa'
import { FiTruck, FiDollarSign } from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'

export default function ActionsSection({ actions = {} }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Link
        to="/transporter/auction-board"
        className="group block transition-all"
      >
        <StatusCard
          variant="default"
          value={t('transporterDashboard.actions.viewAuctions')}
          description={t('transporterDashboard.actions.auctionsNearYou', {
            count: actions.activeAuctions || 0,
          })}
          icon={FaGavel}
          iconTone="brand"
          className="!border-none !bg-[var(--active)] !text-white shadow-sm transition-all hover:brightness-95 hover:shadow-md [&_p:nth-of-type(2)]:!text-white [&_p]:!text-white/90 [&_span]:!bg-white/20 [&_span]:!text-white"
        />
      </Link>

      <Link
        to="/transporter/assign-deliveries"
        className="group block transition-all"
      >
        <StatusCard
          variant="default"
          value={t('transporterDashboard.actions.myDeliveries')}
          description={t('transporterDashboard.actions.activeDeliveries', {
            count: actions.activeDeliveries || 0,
          })}
          icon={FiTruck}
          iconTone="brand"
          className="!border-2 !border-[var(--active)] bg-white shadow-sm transition-all hover:shadow-md"
        />
      </Link>

      <Link
        to="/transporter/payments-payouts"
        className="group block transition-all"
      >
        <StatusCard
          variant="default"
          value={t('transporterDashboard.actions.requestPayout')}
          description={t('transporterDashboard.actions.availableAmount', {
            amount: actions.availablePayout || '—',
          })}
          icon={FiDollarSign}
          iconTone="teal"
          className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        />
      </Link>
    </div>
  )
}
