import { FaGavel } from 'react-icons/fa'
import {
  FiTruck,
  FiCheckCircle,
  FiPackage,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatusCard
        variant="default"
        label="Active Auctions"
        value="12"
        icon={FaGavel}
        iconTone="brand"
      />
      <StatusCard
        variant="default"
        label="Won Deliveries"
        value="8"
        icon={FiCheckCircle}
        iconTone="teal"
      />
      <StatusCard
        variant="default"
        label="In Transit"
        value="5"
        icon={FiTruck}
        iconTone="warning"
      />
      <StatusCard
        variant="default"
        label="Completed Today"
        value="3"
        icon={FiPackage}
        iconTone="purple"
      />
      <StatusCard
        variant="default"
        label="Today's Earnings"
        value="€24,500"
        icon={FiDollarSign}
        iconTone="teal"
      />
      <StatusCard
        variant="default"
        label="Pending Earnings"
        value="€12,300"
        icon={FiClock}
        iconTone="warning"
      />
    </div>
  )
}
