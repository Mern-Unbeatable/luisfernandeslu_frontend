import { normalizeDeliveryStatus } from '../transporter/deliveryMappers'

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

function buildOrderLabel(delivery) {
  const parts = []

  if (delivery.auctionId) {
    parts.push(`Auction ID: ${delivery.auctionId}`)
  }

  const referenceId = delivery.deliveryId || delivery.orderId
  if (referenceId) {
    parts.push(
      `${delivery.deliveryId ? 'Delivery' : 'Order'} ID: ${referenceId}`,
    )
  }

  return parts.join(' · ') || '—'
}

export const ADMIN_LOGISTICS_STATUS_FILTERS = [
  'all',
  'assigned',
  'picked_up',
  'in_transit',
  'delivered',
]

/** Map backend delivery → DeliveryTimeline item shape */
export function mapAdminLogisticsDelivery(delivery) {
  const status = normalizeDeliveryStatus(delivery.status)
  const pickup = splitLocation(delivery.pickupLocation)
  const dropoff = splitLocation(delivery.deliveryLocation)

  return {
    id: delivery.id,
    auctionId: delivery.auctionId,
    orderId: delivery.orderId,
    deliveryId: delivery.deliveryId,
    title: delivery.productName || '—',
    orderLabel: buildOrderLabel(delivery),
    price: delivery.price == null ? '—' : `€${Number(delivery.price)}`,
    distance:
      delivery.distanceKm == null ? '—' : `${delivery.distanceKm} km`,
    distanceKm: Number(delivery.distanceKm) || 0,
    status,
    pickup,
    delivery: dropoff,
    pickupLocation: delivery.pickupLocation,
    deliveryLocation: delivery.deliveryLocation,
    pickedAt: delivery.pickedAt,
    steps: delivery.steps || [],
    transporterName: delivery.transporterName,
    tripStarted: false,
  }
}

function formatDetailMoney(amount, currency = 'EUR') {
  if (amount == null || amount === '') return '—'
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  } catch {
    return `€${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
}

function formatAuctionDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString()
}

function formatWeight(weightKg) {
  if (weightKg == null || weightKg === '') return '—'
  return `${weightKg} kg`
}

/** Map backend logistics detail → admin detail view shape */
export function mapAdminLogisticsDetail(delivery) {
  if (!delivery) return null

  const summary = delivery.summary || {}
  const product = delivery.product || {}

  return {
    id: delivery.id,
    auctionId: delivery.auctionId || summary.auctionId,
    orderId: delivery.orderId,
    deliveryId: delivery.deliveryId,
    status: normalizeDeliveryStatus(delivery.status),
    auctionDate: formatAuctionDate(summary.auctionDate),
    deliveryCharge: formatDetailMoney(summary.deliveryCharge),
    customer: delivery.customer || {},
    transporter: delivery.transporter || {},
    shipping: delivery.shipping || {},
    product: {
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      weight: formatWeight(product.weightKg),
      price: formatDetailMoney(product.price),
    },
    steps: delivery.steps || [],
    trackingEvents: delivery.trackingEvents || [],
  }
}
