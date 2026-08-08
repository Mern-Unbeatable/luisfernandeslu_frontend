import { useState } from 'react'
import DeliveryTimeline from '../../../components/data-display/DeliveryTimeline'
import AuctionDetails from '../../../components/data-display/AuctionDetails'

export default function AssignDeliveriesPage() {
  const [filter, setFilter] = useState('All Deliveries')
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  // Initialize mock deliveries representing the three main status steps
  const initialDeliveries = [
    {
      id: 'del-001',
      title: 'Premium Portland Cement',
      orderLabel: 'Auction ID: AUC-001',
      price: '$8,500',
      distance: '32 km',
      status: 'assigned',
      pickup: {
        title: 'Ambuja Cement Factory',
        subtitle: 'Plot 45, MIDC Kalyan, Maharashtra 421301',
      },
      delivery: {
        title: 'Metro Construction Pvt Ltd',
        subtitle: 'Site 12, Andheri West, Mumbai 400053',
      },
    },
    {
      id: 'del-002',
      title: 'TMT Steel Rods ( 12mm )',
      orderLabel: 'Auction ID: AUC-002',
      price: '$8,500',
      distance: '18 km',
      status: 'picked_up',
      pickup: {
        title: 'Tata Steel Depot',
        subtitle: 'Sector 11, Turbhe, Navi Mumbai 400705',
      },
      delivery: {
        title: 'Skyline Residency Project',
        subtitle: 'Plot 8, Sector 20, Kharghar, Navi Mumbai 410210',
      },
    },
    {
      id: 'del-003',
      title: 'Red Bricks',
      orderLabel: 'Auction ID: AUC-003',
      price: '$8,500',
      distance: '18 km',
      status: 'in_transit',
      pickup: {
        title: 'Brick Kiln Industries',
        subtitle: 'Vasai East, Palghar 401208',
      },
      delivery: {
        title: 'Villa Paradise Construction',
        subtitle: 'Mira Road, Thane 401107',
      },
    },
  ]

  const [deliveries, setDeliveries] = useState(initialDeliveries)

  // Callbacks for dynamic status updates
  const handleStartTrip = (item) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, status: 'in_transit' } : d))
    )
  }

  const handleMarkPickedUp = (item) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, status: 'picked_up' } : d))
    )
  }

  const handleNavigateToDelivery = (item) => {
    // Progress status to in_transit
    setDeliveries((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, status: 'in_transit' } : d))
    )
  }

  const handleVerifyDelivery = (item) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, status: 'delivered' } : d))
    )
  }

  const handleSeeDetails = (item) => {
    // Format delivery details matching AuctionDetails expectations
    const detailedDelivery = {
      ...item,
      auctionId: item.orderLabel?.replace('Auction ID: ', '') || 'AUC-001',
      auctionDate: 'May 18, 2026',
      deliveryCharge: item.price || '$2000.00',
      customer: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 234-5678',
        email: 'sarah.johnson@email.com',
        deliveryAddress: item.delivery.title + ', ' + item.delivery.subtitle,
      },
      product: {
        name: item.title,
        sku: 'EXC-HD-2024',
        quantity: item.title.includes('Cement') ? '500 bags (50kg each)' : item.title.includes('Steel') ? '200 rods (12m each)' : '5000 bricks',
        weight: '25000 kg',
        price: item.price,
      },
      shipping: {
        pickupLocation: item.pickup.title + ', ' + item.pickup.subtitle,
        unloadingInstructions: item.delivery.title + ', ' + item.delivery.subtitle,
        accessCondition: 'Loading dock with ramp',
        additionalNotes: 'Delivery must be coordinated with site manager. Contact 24 hours before arrival.',
      }
    }
    setSelectedDelivery(detailedDelivery)
  }

  // Filter deliveries based on selection
  const filteredDeliveries = deliveries.filter((d) => {
    if (filter === 'Assigned') return d.status === 'assigned'
    if (filter === 'Picked Up') return d.status === 'picked_up'
    if (filter === 'In Transit') return d.status === 'in_transit'
    if (filter === 'Delivered') return d.status === 'delivered'
    return true // 'All Deliveries'
  })

  // Render detail view if clicked
  if (selectedDelivery) {
    return (
      <AuctionDetails
        role="transporter"
        status={selectedDelivery.status}
        auction={selectedDelivery}
        onBack={() => setSelectedDelivery(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Assigned Deliveries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredDeliveries.length} active deliveries
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
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

      {/* Timeline List */}
      <DeliveryTimeline
        items={filteredDeliveries}
        onStartTrip={handleStartTrip}
        onMarkPickedUp={handleMarkPickedUp}
        onNavigateToDelivery={handleNavigateToDelivery}
        onVerifyDelivery={handleVerifyDelivery}
        onSeeDetails={handleSeeDetails}
      />
    </div>
  )
}
