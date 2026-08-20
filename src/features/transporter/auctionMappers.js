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

function formatBidLabel(createdAt) {
  if (!createdAt) return '—'
  const diffMs = Date.now() - new Date(createdAt).getTime()
  const diffSec = Math.max(0, Math.floor(diffMs / 1000))
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  return new Date(createdAt).toLocaleDateString()
}

function mapBid(bid) {
  return {
    id: bid.bidId,
    amount: bid.bidAmount,
    label: formatBidLabel(bid.createdAt),
    isUserBid: Boolean(bid.isMine),
    createdAt: bid.createdAt,
  }
}

/** Map backend auction → AuctionCard / page shape */
export function mapTransporterAuction(auction) {
  const remainingSeconds = getRemainingSeconds(auction.expiresAt)
  const isEnded = Boolean(auction.isEnded) || remainingSeconds <= 0

  return {
    id: auction.auctionId,
    auctionId: auction.auctionId,
    title: auction.productName,
    quantity: auction.quantity,
    pickupLocation: auction.pickupLocation,
    deliveryLocation: auction.deliveryLocation,
    distance:
      auction.distanceKm == null ? '—' : `${auction.distanceKm} km`,
    distanceKm: Number(auction.distanceKm) || 0,
    remainingLabel: formatRemainingLabel(remainingSeconds, isEnded),
    remainingSeconds,
    status: isEnded ? 'ended' : 'bidding',
    canBid: Boolean(auction.canBid) && !isEnded,
    auctionStatus: auction.auctionStatus,
    expiresAt: auction.expiresAt,
    bidStartFrom: auction.bidStartFrom,
    isFactoryOrder: Boolean(auction.isFactoryOrder),
    bids: (auction.bids || []).map(mapBid),
    myBid: auction.myBid ? mapBid(auction.myBid) : null,
  }
}

export function getApiFilterParam(uiFilter) {
  // Backend currently documented with filter=all; UI filters applied client-side.
  void uiFilter
  return 'all'
}

export function applyClientAuctionFilter(auctions, uiFilter) {
  const list = Array.isArray(auctions) ? [...auctions] : []

  if (uiFilter === 'ended') {
    return list.filter((auction) => auction.status === 'ended')
  }

  if (uiFilter === 'endingSoon') {
    return list
      .filter((auction) => auction.status === 'bidding')
      .sort((a, b) => a.remainingSeconds - b.remainingSeconds)
  }

  if (uiFilter === 'nearestFirst') {
    return list
      .filter((auction) => auction.status === 'bidding')
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }

  return list
}
