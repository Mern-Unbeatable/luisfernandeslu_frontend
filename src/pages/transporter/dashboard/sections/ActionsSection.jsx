import { Link } from 'react-router-dom'
import { FaGavel } from 'react-icons/fa'
import { FiTruck, FiDollarSign } from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'

export default function ActionsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* View Auctions */}
      <Link
        to="/transporter/auction-board"
        className="group block transition-all"
      >
        <StatusCard
          variant="default"
          value="View Auctions"
          description="12 active auctions near you"
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
          value="My Deliveries"
          description="8 active deliveries"
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
          value="Request Payout"
          description="€36,800 available"
          icon={FiDollarSign}
          iconTone="teal"
          className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        />
      </Link>
    </div>
  )
}
