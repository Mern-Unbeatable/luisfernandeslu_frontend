import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeliveryTimeline from '../../../components/data-display/DeliveryTimeline'
import AuctionDetails from '../../../components/data-display/AuctionDetails'
import { useAssignDeliveries } from './AssignDeliveriesContext'

export default function AssignDeliveriesPage() {
  const navigate = useNavigate()
  const { deliveries, updateDelivery } = useAssignDeliveries()
  const [filter, setFilter] = useState('All Deliveries')
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  const handleStartTrip = (item) => {
    updateDelivery(item.id, { tripStarted: true })
  }

  const handleMarkPickedUp = (item) => {
    if (!item.tripStarted) return
    updateDelivery(item.id, { status: 'picked_up', tripStarted: false })
  }

  const handleNavigateToDelivery = (item) => {
    updateDelivery(item.id, { status: 'in_transit' })
  }

  const handleVerifyDeliveryClick = (item) => {
    navigate(`/transporter/assign-deliveries/${item.id}/verify`)
  }

  const handleSeeDetails = (item) => {
    const detailedDelivery = {
      ...item,
      auctionId: item.orderLabel?.replace('Auction ID: ', '') || 'AUC-001',
      auctionDate: 'May 18, 2026',
      deliveryCharge: item.price || '€2000.00',
      customer: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 234-5678',
        email: 'sarah.johnson@email.com',
        deliveryAddress: item.delivery.title + ', ' + item.delivery.subtitle,
      },
      product: {
        name: item.title,
        sku: 'EXC-HD-2024',
        quantity: item.title.includes('Cement')
          ? '500 bags (50kg each)'
          : item.title.includes('Steel')
            ? '200 rods (12m each)'
            : '10,000 pieces',
        weight: '25000 kg',
        price: item.price,
      },
      shipping: {
        pickupLocation: item.pickup.title + ', ' + item.pickup.subtitle,
        unloadingInstructions: item.delivery.title + ', ' + item.delivery.subtitle,
        accessCondition: 'Loading dock with ramp',
        additionalNotes:
          'Delivery must be coordinated with site manager. Contact 24 hours before arrival.',
      },
    }
    setSelectedDelivery(detailedDelivery)
  }

  const filteredDeliveries = deliveries.filter((d) => {
    if (filter === 'Assigned') return d.status === 'assigned'
    if (filter === 'Picked Up') return d.status === 'picked_up'
    if (filter === 'In Transit') return d.status === 'in_transit'
    if (filter === 'Delivered') return d.status === 'delivered'
    return true
  })

  if (selectedDelivery) {
    return (
      <AuctionDetails
        role="transporter"
        status={selectedDelivery.status}
        auction={selectedDelivery}
        onBack={() => setSelectedDelivery(null)}
        onMessage={() => navigate('/messages')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Assigned Deliveries
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {filteredDeliveries.length} active deliveries
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
          >
            <option>All Deliveries</option>
            <option>Assigned</option>
            <option>Picked Up</option>
            <option>In Transit</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      <DeliveryTimeline
        items={filteredDeliveries}
        onStartTrip={handleStartTrip}
        onMarkPickedUp={handleMarkPickedUp}
        onNavigateToDelivery={handleNavigateToDelivery}
        onVerifyDelivery={handleVerifyDeliveryClick}
        onSeeDetails={handleSeeDetails}
      />
    </div>
  )
}
