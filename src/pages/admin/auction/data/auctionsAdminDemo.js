import { DEMO_AUCTION_LIVE } from '@/data/demoData'

/** Admin auction board demo — six cards matching design mocks. */
export const ADMIN_AUCTIONS = [
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
    dateLabel: '6/21/2026',
    remainingLabel: '5m 11s',
    remainingSeconds: 311,
    status: 'bidding',
    bids: [
      {
        id: 'a1-b1',
        amount: 285,
        at: '5/20/2026, 4:16:01 PM',
        transporterName: 'FastShip Logistics',
      },
      {
        id: 'a1-b2',
        amount: 290,
        at: '5/20/2026, 4:15:01 PM',
        transporterName: 'QuickDelivery Express',
      },
      {
        id: 'a1-b3',
        amount: 295,
        at: '5/20/2026, 4:14:01 PM',
        transporterName: 'BulkFreight Co',
      },
    ],
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
    dateLabel: '6/21/2026',
    remainingLabel: 'ENDED',
    remainingSeconds: 0,
    status: 'ended',
    bids: [
      {
        id: 'a2-b1',
        amount: 285,
        at: '5/20/2026, 4:18:01 PM',
        transporterName: 'FastShip Logistics',
      },
      {
        id: 'a2-b2',
        amount: 290,
        at: '5/20/2026, 4:17:01 PM',
        transporterName: 'QuickDelivery Express',
      },
      {
        id: 'a2-b3',
        amount: 275,
        at: '5/20/2026, 4:16:01 PM',
        transporterName: 'BulkFreight Co',
      },
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
    dateLabel: '6/21/2026',
    remainingLabel: '4m 00s',
    remainingSeconds: 240,
    status: 'bidding',
    bids: DEMO_AUCTION_LIVE.bids.slice(0, 3),
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
    dateLabel: '6/21/2026',
    remainingLabel: '3m 31s',
    remainingSeconds: 211,
    status: 'bidding',
    bids: DEMO_AUCTION_LIVE.bids.slice(0, 3),
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
    dateLabel: '6/21/2026',
    remainingLabel: '2m 45s',
    remainingSeconds: 165,
    status: 'bidding',
    bids: DEMO_AUCTION_LIVE.bids.slice(0, 3),
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
    dateLabel: '6/21/2026',
    remainingLabel: '1m 31s',
    remainingSeconds: 91,
    status: 'bidding',
    bids: DEMO_AUCTION_LIVE.bids.slice(0, 3),
  },
]

export const ADMIN_AUCTION_FILTER_OPTIONS = [
  { value: 'all', labelKey: 'adminAuction.filters.all' },
  { value: 'ending_soon', labelKey: 'adminAuction.filters.endingSoon' },
  { value: 'nearest_first', labelKey: 'adminAuction.filters.nearestFirst' },
  { value: 'ended', labelKey: 'adminAuction.filters.ended' },
]

export function filterAndSortAdminAuctions(auctions, filterKey) {
  const key = String(filterKey || 'all').toLowerCase()

  const filtered = auctions.filter((auc) => {
    const status = (auc.status || '').toLowerCase()
    if (key === 'ended') return status === 'ended'
    if (key === 'ending_soon' || key === 'nearest_first') {
      return status === 'bidding'
    }
    return true
  })

  return [...filtered].sort((a, b) => {
    if (key === 'ending_soon') {
      return (a.remainingSeconds ?? 0) - (b.remainingSeconds ?? 0)
    }
    if (key === 'nearest_first') {
      return (a.distanceKm ?? 0) - (b.distanceKm ?? 0)
    }
    return 0
  })
}

export function countActiveAdminAuctions(auctions) {
  return auctions.filter((a) => (a.status || '').toLowerCase() === 'bidding')
    .length
}
