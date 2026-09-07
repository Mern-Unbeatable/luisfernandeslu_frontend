function getRemainingSeconds(expiresAt) {
  if (!expiresAt) return 0
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
}

function formatRemainingLabel(seconds, isEnded) {
  if (isEnded || seconds <= 0) return 'ENDED'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
  return `${minutes}m ${secs}s`
}

function formatDateLabel(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('T')[0].split('-').map(Number)
  if (!y || !m || !d) return new Date(isoDate).toLocaleDateString()
  return `${m}/${d}/${y}`
}

function formatBidAt(createdAt) {
  if (!createdAt) return '—'
  return new Date(createdAt).toLocaleString()
}

function mapAdminBid(bid) {
  return {
    id: bid.bidId,
    amount: bid.bidAmount,
    transporterName: bid.transporterName,
    at: formatBidAt(bid.createdAt),
    isWinner: Boolean(bid.isWinner),
  }
}

/** Map backend auction → admin AuctionCard shape */
export function mapAdminAuction(auction) {
  const remainingSeconds = getRemainingSeconds(auction.expiresAt)
  const isEnded = Boolean(auction.isEnded) || remainingSeconds <= 0

  return {
    id: auction.id,
    auctionId: auction.auctionId,
    title: auction.productName,
    quantity: auction.quantity,
    pickupLocation: auction.pickupLocation,
    deliveryLocation: auction.deliveryLocation,
    distance: auction.distanceKm == null ? '—' : `${auction.distanceKm} km`,
    distanceKm: Number(auction.distanceKm) || 0,
    dateLabel: formatDateLabel(auction.createdAt),
    remainingLabel: formatRemainingLabel(remainingSeconds, isEnded),
    remainingSeconds,
    status: isEnded ? 'ended' : 'bidding',
    auctionStatus: auction.auctionStatus,
    isEnded,
    canBid: Boolean(auction.canBid) && !isEnded,
    bids: (auction.bids || []).map(mapAdminBid),
  }
}

export function getAdminApiFilterParam(uiFilter) {
  const map = {
    all: 'all',
    ending_soon: 'ending_soon',
    nearest: 'nearest',
    ended: 'ended',
  }
  return map[uiFilter] || 'all'
}

export function countActiveAdminAuctions(auctions) {
  return auctions.filter((auction) => !auction.isEnded && auction.canBid).length
}
