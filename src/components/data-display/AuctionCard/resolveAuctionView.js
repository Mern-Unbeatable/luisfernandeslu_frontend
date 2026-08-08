/**
 * Resolve which auction card layout to render.
 * - status=ended → ended bidding card (no bid input)
 * - supplier/factory + open → created order card
 * - supplier/factory + assigned → assigned transporter card
 * - transporter → live bidding card
 * - admin → competing bids card
 */
export function resolveAuctionView({ role, status }) {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'ended' || normalized === 'closed') return 'ended'
  if (role === 'transporter') return 'transporter'
  if (role === 'admin') return 'admin'
  if (normalized === 'assigned') return 'assigned'
  return 'created'
}
