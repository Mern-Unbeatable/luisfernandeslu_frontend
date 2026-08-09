import DeliveryTimeline from '../../../components/data-display/DeliveryTimeline'
import { DEMO_DELIVERY_TIMELINE_ITEMS } from '@/data/demoData'

export default function DeliveryLogisticsPage() {
  return (
    <DeliveryTimeline
      items={DEMO_DELIVERY_TIMELINE_ITEMS}
      onStartTrip={() => {}}
      onMarkPickedUp={() => {}}
      onNavigateToDelivery={() => {}}
      onVerifyDelivery={() => {}}
      onSeeDetails={() => {}}
    />
  )
}
