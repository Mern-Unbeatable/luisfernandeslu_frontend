/**
 * Resolve which auction card layout to render.
 * - supplier/factory + open → created order card (image 1)
 * - supplier/factory + assigned → assigned transporter card (image 4)
 * - transporter → live bidding card (image 2)
 * - admin → competing bids card (image 3)
 */
export function resolveAuctionView({ role, status }) {
  if (role === 'transporter') return 'transporter'
  if (role === 'admin') return 'admin'
  if (status === 'assigned') return 'assigned'
  return 'created'
}
