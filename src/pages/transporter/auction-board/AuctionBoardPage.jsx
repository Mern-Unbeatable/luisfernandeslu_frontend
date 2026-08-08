import { useState } from 'react'
import { DEMO_AUCTION_LIVE } from '../../../data/demoData'
import AuctionCard from '../../../components/data-display/AuctionCard'
import AuctionDetails from '../../../components/data-display/AuctionDetails'

export default function AuctionBoardPage() {
  const [filter, setFilter] = useState('All')
  const [selectedAuction, setSelectedAuction] = useState(null)

  // Generate mock active and ended auctions based on the design images
  const initialAuctions = [
    {
      ...DEMO_AUCTION_LIVE,
      id: 'auc-001',
      auctionId: 'AUC-001',
      title: 'Premium Portland Cement',
      quantity: '500 bags (50kg each)',
      pickupLocation: 'Ambuja Cement Factory, Kalyan',
      deliveryLocation: 'Metro Construction Site, Andheri West',
      distance: '32 km',
      distanceKm: 32,
      remainingLabel: '4m 11s',
      remainingSeconds: 251,
      status: 'bidding',
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: 'auc-002',
      auctionId: 'AUC-002',
      title: 'TMT Steel Rods (12mm)',
      quantity: '200 rods (12m each)',
      pickupLocation: 'Tata Steel Depot, Turbhe',
      deliveryLocation: 'Residential Project, Kharghar',
      distance: '32 km',
      distanceKm: 32,
      remainingLabel: 'ENDED',
      remainingSeconds: 0,
      status: 'ended',
      bids: [
        { id: 'b2-1', amount: 285, label: 'Just now', transporterName: 'FastShip Logistics' },
        { id: 'b2-2', amount: 290, label: '1 min ago', transporterName: 'Swift Transport Co.' },
        { id: 'b2-3', amount: 310, label: '3 min ago', transporterName: 'RoadRunner Freight' },
        { id: 'b2-4', amount: 295, label: '2 min ago', isUserBid: true },
      ],
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: 'auc-003',
      auctionId: 'AUC-003',
      title: 'Premium Portland Cement (Batch B)',
      quantity: '500 bags (50kg each)',
      pickupLocation: 'Ambuja Cement Factory, Kalyan',
      deliveryLocation: 'Metro Construction Site, Andheri West',
      distance: '32 km',
      distanceKm: 32,
      remainingLabel: '3m 11s',
      remainingSeconds: 191,
      status: 'bidding',
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: 'auc-004',
      auctionId: 'AUC-004',
      title: 'Premium Portland Cement (Batch C)',
      quantity: '500 bags (50kg each)',
      pickupLocation: 'Ambuja Cement Factory, Kalyan',
      deliveryLocation: 'Metro Construction Site, Andheri West',
      distance: '32 km',
      distanceKm: 32,
      remainingLabel: '3m 0s',
      remainingSeconds: 180,
      status: 'bidding',
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: 'auc-005',
      auctionId: 'AUC-005',
      title: 'TMT Steel Rods (16mm)',
      quantity: '150 rods (12m each)',
      pickupLocation: 'Tata Steel Depot, Turbhe',
      deliveryLocation: 'Residential Project, Kharghar',
      distance: '15 km',
      distanceKm: 15,
      remainingLabel: 'ENDED',
      remainingSeconds: 0,
      status: 'ended',
      bids: [
        { id: 'b5-1', amount: 305, label: '5 min ago', transporterName: 'FastShip Logistics' },
        { id: 'b5-2', amount: 315, label: '8 min ago', isUserBid: true },
      ],
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: 'auc-006',
      auctionId: 'AUC-006',
      title: 'Premium Portland Cement (Batch D)',
      quantity: '500 bags (50kg each)',
      pickupLocation: 'Ambuja Cement Factory, Kalyan',
      deliveryLocation: 'Metro Construction Site, Andheri West',
      distance: '10 km',
      distanceKm: 10,
      remainingLabel: '1m 45s',
      remainingSeconds: 105,
      status: 'bidding',
    },
  ]

  const [auctions, setAuctions] = useState(initialAuctions)

  const handlePlaceBid = (bidAmount, auction) => {
    if (!bidAmount) return
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auction.id) {
          const newBid = {
            id: `b-${Date.now()}`,
            amount: Number(bidAmount),
            label: 'Just now',
            transporterName: 'You (Transporter)',
          }
          return {
            ...auc,
            bids: [newBid, ...auc.bids],
          }
        }
        return auc
      })
    )
  }

  // Filter and sort auctions
  const filteredAuctions = auctions
    .filter((auc) => {
      const selectedFilter = filter.toLowerCase().trim()
      const aucStatus = (auc.status || '').toLowerCase().trim()

      if (selectedFilter === 'ended') {
        return aucStatus === 'ended'
      }
      if (selectedFilter === 'ending soon' || selectedFilter === 'nearest first') {
        return aucStatus === 'bidding'
      }
      return true // 'all'
    })
    .sort((a, b) => {
      const selectedFilter = filter.toLowerCase().trim()
      if (selectedFilter === 'ending soon') {
        return a.remainingSeconds - b.remainingSeconds
      }
      if (selectedFilter === 'nearest first') {
        return a.distanceKm - b.distanceKm
      }
      return 0
    })

  // Format clicked card data to load details properly
  const handleCardClick = (e, auction) => {
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'BUTTON' ||
      e.target.closest('button') ||
      e.target.closest('input')
    ) {
      return
    }

    const detailedAuction = {
      ...auction,
      auctionId: auction.auctionId || 'ORD-: AUC-001',
      auctionDate: auction.dateLabel || 'May 18, 2026',
      deliveryCharge: auction.deliveryCharge || '$2000.00',
      customer: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 234-5678',
        email: 'sarah.johnson@email.com',
        deliveryAddress: auction.deliveryLocation || 'Metro Construction Site, Andheri West',
      },
      product: {
        name: auction.title || 'Premium Portland Cement',
        sku: 'EXC-HD-2024',
        quantity: auction.quantity || '500 bags (50kg each)',
        weight: '25000 kg',
        price: '$85,000',
      },
      shipping: {
        pickupLocation: auction.pickupLocation || 'Ambuja Cement Factory, Kalyan',
        unloadingInstructions: auction.deliveryLocation || 'Metro Construction Site, Andheri West',
        accessCondition: 'Loading dock with ramp',
        additionalNotes: 'Delivery must be coordinated with site manager. Contact 24 hours before arrival.',
      }
    }
    setSelectedAuction(detailedAuction)
  }

  // Render detail view if card is clicked
  if (selectedAuction) {
    return (
      <AuctionDetails
        role="transporter"
        status="assigned"
        auction={selectedAuction}
        onBack={() => setSelectedAuction(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Auction Board
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {filteredAuctions.length} auctions matching your selection
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-sm font-medium text-gray-500">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
          >
            <option>All</option>
            <option>Ending Soon</option>
            <option>Nearest First</option>
            <option>Ended</option>
          </select>
        </div>
      </div>

      {/* Grid of Auction Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredAuctions.map((auction) => (
          <div
            key={auction.id}
            onClick={(e) => handleCardClick(e, auction)}
            className="cursor-pointer transition-transform hover:scale-[1.005]"
          >
            <AuctionCard
              role="transporter"
              auction={auction}
              onPlaceBid={handlePlaceBid}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
