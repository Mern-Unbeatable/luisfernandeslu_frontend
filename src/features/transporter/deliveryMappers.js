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

function mapLocationBlock(location, fallbackLocation) {
  if (location && typeof location === 'object') {
    return {
      title: location.name || '—',
      subtitle: location.address || '',
    }
  }
  return splitLocation(fallbackLocation)
}

function formatLocationString(location, fallbackLocation) {
  if (location && typeof location === 'object') {
    return [location.name, location.address].filter(Boolean).join(', ')
  }
  return fallbackLocation || ''
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
  const pickup = mapLocationBlock(delivery.pickup, delivery.pickupLocation)
  const dropoff = mapLocationBlock(delivery.delivery, delivery.deliveryLocation)

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
    pickupLocation: formatLocationString(delivery.pickup, delivery.pickupLocation),
    deliveryLocation: formatLocationString(
      delivery.delivery,
      delivery.deliveryLocation,
    ),
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

function formatAuctionDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString()
}

function formatMoney(amount) {
  if (amount == null || amount === '') return '—'
  const value = Number(amount)
  if (!Number.isFinite(value)) return String(amount)
  return `€${value}`
}

function formatWeight(weightKg) {
  if (weightKg == null || weightKg === '') return '—'
  return `${weightKg} kg`
}

/** Map backend delivery detail → AuctionDetails shape */
export function mapTransporterDeliveryDetails(delivery) {
  const status = normalizeDeliveryStatus(delivery.status, delivery.orderStatus)
  const customer = delivery.customer || {}
  const shipping = delivery.shipping || {}
  const product = delivery.product || {}
  const transporter = delivery.assignedTransporter || {}
  const bidLabel = formatMoney(delivery.bidAmount ?? transporter.bidAmount)

  return {
    id: delivery.auctionId,
    auctionId: delivery.auctionId,
    orderId: delivery.orderId,
    status,
    orderStatus: delivery.orderStatus,
    auctionDate: formatAuctionDate(delivery.auctionDate),
    deliveryCharge: bidLabel,
    distanceKm: delivery.distanceKm,
    quantity: delivery.quantity,
    steps: delivery.steps || [],
    actions: delivery.actions || {},
    customer: {
      name: customer.name || '—',
      phone: customer.phone || '—',
      email: customer.email || '—',
      deliveryAddress: customer.deliveryAddress || '—',
    },
    shipping: {
      pickupLocation: shipping.pickupLocation || '—',
      deliveryLocation: shipping.deliveryLocation || '—',
      unloadingInstructions: shipping.unloadingInstructions || '—',
      accessCondition: shipping.accessCondition || '—',
      additionalNotes: shipping.additionalNotes || '—',
    },
    product: {
      name: product.name || '—',
      sku: product.sku || '—',
      quantity: delivery.quantity || '—',
      weight: formatWeight(product.weightKg ?? product.weight),
      price: bidLabel,
    },
    transporter: {
      id: transporter.id,
      name: transporter.name || '—',
      bidAmount: formatMoney(transporter.bidAmount ?? delivery.bidAmount),
    },
    pickupLocation: shipping.pickupLocation,
    deliveryLocation: shipping.deliveryLocation,
  }
}
