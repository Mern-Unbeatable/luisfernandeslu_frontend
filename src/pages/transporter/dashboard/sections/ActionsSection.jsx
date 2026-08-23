import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaGavel } from 'react-icons/fa'
import { FiTruck, FiDollarSign } from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'

export default function ActionsSection() {
  const { t } = useTranslation()

  const activeAuctionsCount = 12
  const activeDeliveriesCount = 8
  const availablePayout = '€36,800'

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* View Auctions */}
      <Link
        to="/transporter/auction-board"
        className="group block transition-all"
      >
        <StatusCard
          variant="default"
          value={t('transporterDashboard.actions.viewAuctions')}
          description={t('transporterDashboard.actions.auctionsNearYou', {
            count: activeAuctionsCount,
          })}
          icon={FaGavel}
          iconTone="brand"
          className="!bg-[var(--active)] !border-none !text-white [&_p]:!text-white/90 [&_p:nth-of-type(2)]:!text-white [&_span]:!bg-white/20 [&_span]:!text-white shadow-sm transition-all hover:brightness-95 hover:shadow-md"
        />
      </Link>

      {/* My Deliveries */}
      <Link
        to="/transporter/assign-deliveries"
        className="group block transition-all"
      >
        <StatusCard
          variant="default"
          value={t('transporterDashboard.actions.myDeliveries')}
          description={t('transporterDashboard.actions.activeDeliveries', {
            count: activeDeliveriesCount,
          })}
          icon={FiTruck}
          iconTone="brand"
          className="!border-2 !border-[var(--active)] bg-white shadow-sm transition-all hover:shadow-md"
        />
      </Link>

      {/* Request Payout */}
      <Link
        to="/transporter/payments-payouts"
        className="group block transition-all"
      >
        <StatusCard
          variant="default"
          value={t('transporterDashboard.actions.requestPayout')}
          description={t('transporterDashboard.actions.availableAmount', {
            amount: availablePayout,
          })}
          icon={FiDollarSign}
          iconTone="teal"
          className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        />
      </Link>
    </div>
  )
}
