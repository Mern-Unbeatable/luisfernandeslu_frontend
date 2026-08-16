import { useState } from 'react'
import DeliveryTimeline from '../../../components/data-display/DeliveryTimeline'
import AuctionDetails from '../../../components/data-display/AuctionDetails'

export default function OrderHistoryPage() {
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  // Initialize mock deliveries representing completed/delivered items
  const completedDeliveries = [
    {
      id: 'del-003',
      title: 'Red Bricks',
      orderLabel: 'Delivery ID: DL-003',
      price: '€14,300',
      distance: '21 km',
      status: 'delivered',
      pickup: {
        title: 'Brick Kiln Industries',
        subtitle: 'Vasai East, Palghar 401208',
      },
      delivery: {
        title: 'Villa Paradise Construction',
        subtitle: 'Mira Road, Thane 401107',
      },
    },
    {
      id: 'del-004',
      title: 'Ready Mix Concrete',
      orderLabel: 'Delivery ID: DL-004',
      price: '€6,200',
      distance: '12 km',
      status: 'delivered',
      pickup: {
        title: 'UltraMix Concrete Plant',
        subtitle: 'Ghodbunder Road, Thane 400607',
      },
      delivery: {
        title: 'Sunrise Tower Project',
        subtitle: 'Pokhran Road, Thane 400606',
      },
    },
  ]

  const handleSeeDetails = (item) => {
    // Format delivery details matching AuctionDetails expectations
    const detailedDelivery = {
      ...item,
      auctionId: item.orderLabel?.replace('Delivery ID: ', '') || 'DL-003',
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
        quantity: item.title.includes('Concrete') ? '6m³' : '10,000 pieces',
        weight: '15000 kg',
        price: item.price,
      },
      shipping: {
        pickupLocation: item.pickup.title + ', ' + item.pickup.subtitle,
        unloadingInstructions: item.delivery.title + ', ' + item.delivery.subtitle,
        accessCondition: 'Loading dock with ramp',
        additionalNotes: 'Delivery was successfully completed. Sign-off sheet archived.',
      }
    }
    setSelectedDelivery(detailedDelivery)
  }

  // Render detail view if clicked
  if (selectedDelivery) {
    return (
      <AuctionDetails
        role="transporter"
        status="complete"
        auction={selectedDelivery}
        onBack={() => setSelectedDelivery(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Delivery History
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {completedDeliveries.length} completed deliveries
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value="Delivered"
            disabled
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-400 outline-none cursor-not-allowed"
          >
            <option>Delivered</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <DeliveryTimeline
        items={completedDeliveries}
        onSeeDetails={handleSeeDetails}
      />
    </div>
  )
}