/** Demo auction payloads for UI previews */
export const DEMO_AUCTION_CREATED = {
  id: 'auc-ord-001',
  orderId: 'ORD-2026-001',
  pickupLocation: '1234 Main St, Los Angeles, CA',
  customerName: 'John Smith',
  deliveryLocation: '5678 Oak Ave, San Francisco, CA',
  productName: 'Construction Materials - Steel Beams',
  status: 'open',
}

export const DEMO_AUCTION_ASSIGNED = {
  id: 'auc-ord-002',
  orderId: 'ORD-2026-002',
  productName: 'Heavy Machinery - Excavator',
  pickupLocation: '890 Industrial Blvd, Houston, TX',
  deliveryLocation: '2345 Commerce St, Dallas, TX',
  assignedTransporter: 'Swift Transport Co.',
  bidPrice: 4500,
  status: 'assigned',
}

export const DEMO_AUCTION_LIVE = {
  id: 'auc-001',
  auctionId: 'AUC-001',
  title: 'Premium Portland Cement',
  quantity: '500 bags (50kg each)',
  pickupLocation: 'Ambuja Cement Factory, Kalyan',
  deliveryLocation: 'Metro Construction Site, Andheri West',
  distance: '32 km',
  endsAt: null,
  remainingLabel: '5m 11s',
  dateLabel: '6/21/2026',
  status: 'bidding',
  bids: [
    { id: 'b1', amount: 285, label: 'Just now', at: '5/20/2026, 4:16:01 PM', transporterName: 'FastShip Logistics' },
    { id: 'b2', amount: 290, label: '1 min ago', at: '5/20/2026, 4:15:01 PM', transporterName: 'Swift Transport Co.' },
    { id: 'b3', amount: 310, label: '3 min ago', at: '5/20/2026, 4:13:01 PM', transporterName: 'RoadRunner Freight' },
    { id: 'b4', amount: 320, label: '4 min ago', at: '5/20/2026, 4:12:01 PM', transporterName: 'HaulMaster Inc.' },
  ],
}

export function formatMoney(amount, currency = 'USD') {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount))
  } catch {
    return `$${amount}`
  }
}
