const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value) {
  return UUID_RE.test(String(value || '').trim())
}

/** Prefer real UUID for bid/API paths; fall back to auctionId/code. */
export function resolveAuctionApiId(auction) {
  if (!auction || typeof auction !== 'object') return null

  const candidates = [
    auction.id,
    auction.auctionUuid,
    auction.uuid,
    auction._id,
    auction.auctionID,
    auction.auctionId,
  ]

  const uuid = candidates.find(isUuid)
  if (uuid) return String(uuid).trim()

  const fallback = auction.auctionId || auction.id
  return fallback ? String(fallback).trim() : null
}

function resolveAuctionCode(auction, apiId) {
  if (auction.auctionCode) return String(auction.auctionCode)
  if (auction.code) return String(auction.code)
  if (auction.auctionId && !isUuid(auction.auctionId)) {
    return String(auction.auctionId)
  }
  if (apiId && !isUuid(apiId)) return String(apiId)
  return null
}

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
  const apiId = resolveAuctionApiId(auction)
  const auctionCode = resolveAuctionCode(auction, apiId)

  return {
    id: apiId,
    auctionId: apiId,
    auctionCode,
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
