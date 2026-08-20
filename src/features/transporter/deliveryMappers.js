function splitLocation(location) {
  const value = String(location || '').trim()
  if (!value) return { title: '—', subtitle: '' }

  const commaIndex = value.indexOf(',')
  if (commaIndex === -1) {
    return { title: value, subtitle: '' }
  }

  return {
    title: value.slice(0, commaIndex).trim(),
    subtitle: value.slice(commaIndex + 1).trim(),
  }
}

export function normalizeDeliveryStatus(status, orderStatus) {
  const raw = String(orderStatus || status || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')

  if (raw === 'pickedup' || raw === 'picked_up') return 'picked_up'
  if (raw === 'intransit' || raw === 'in_transit') return 'in_transit'
  if (raw === 'delivered' || raw === 'complete' || raw === 'completed') {
    return 'delivered'
  }
  if (raw === 'assigned') return 'assigned'
  return 'assigned'
}

export function getApiDeliveryStatusParam(uiFilter) {
  if (uiFilter === 'assigned') return 'assigned'
  if (uiFilter === 'pickedUp') return 'picked_up'
  if (uiFilter === 'inTransit') return 'in_transit'
  if (uiFilter === 'delivered') return 'delivered'
  return 'all'
}

/** Map backend delivery → DeliveryTimeline item shape */
export function mapTransporterDelivery(delivery) {
  const actions = delivery.actions || {}
  const status = normalizeDeliveryStatus(delivery.status, delivery.orderStatus)
  const pickup = splitLocation(delivery.pickupLocation)
  const dropoff = splitLocation(delivery.deliveryLocation)

  return {
    id: delivery.auctionId,
    auctionId: delivery.auctionId,
    orderId: delivery.orderId,
    title: delivery.productName || '—',
    orderLabel: delivery.orderId
      ? `Order ID: ${delivery.orderId}`
      : `Auction ID: ${delivery.auctionId || '—'}`,
    price:
      delivery.bidAmount == null ? '—' : `€${Number(delivery.bidAmount)}`,
    distance:
      delivery.distanceKm == null ? '—' : `${delivery.distanceKm} km`,
    distanceKm: Number(delivery.distanceKm) || 0,
    status,
    orderStatus: delivery.orderStatus,
    pickup,
    delivery: dropoff,
    pickupLocation: delivery.pickupLocation,
    deliveryLocation: delivery.deliveryLocation,
    pickedAt: delivery.pickedAt,
    tripStarted: Boolean(actions.canMarkPickedUp),
    actions: {
      canStartTrip: Boolean(actions.canStartTrip),
      canMarkPickedUp: Boolean(actions.canMarkPickedUp),
      canNavigateToDelivery: Boolean(actions.canNavigateToDelivery),
      canVerifyDelivery: Boolean(actions.canVerifyDelivery),
      canSeeDetails: actions.canSeeDetails !== false,
      otpSent: Boolean(actions.otpSent),
    },
    bidAmount: delivery.bidAmount,
  }
}
