import { DEMO_DELIVERY_TIMELINE_ITEMS } from '@/data/demoData'

export const ADMIN_DELIVERY_ITEMS = DEMO_DELIVERY_TIMELINE_ITEMS

const MOCK_CUSTOMER = {
  name: 'Sarah Johnson',
  phone: '+1 (555) 234-5678',
  email: 'sarah.johnson@email.com',
  deliveryAddress: '2345 Commerce St, Dallas, TX 75201',
}

const MOCK_TRANSPORTER = {
  name: 'Sarah Johnson',
  phone: '+1 (555) 234-5678',
  email: 'sarah.johnson@email.com',
}

function parseReference(orderLabel = '') {
  const label = String(orderLabel)
  const auctionMatch = label.match(/Auction ID:\s*(.+)/i)
  if (auctionMatch) return auctionMatch[1].trim()
  const deliveryMatch = label.match(/Delivery ID:\s*(.+)/i)
  if (deliveryMatch) return deliveryMatch[1].trim()
  return label.trim() || 'AUC-001'
}

export function getAdminDeliveryRow(id) {
  return ADMIN_DELIVERY_ITEMS.find((item) => item.id === id) ?? null
}

export function getAdminDeliveryDetail(id) {
  const item = getAdminDeliveryRow(id)
  if (!item) return null

  const referenceId = parseReference(item.orderLabel)
  const pickupLine = [item.pickup?.title, item.pickup?.subtitle]
    .filter(Boolean)
    .join(', ')
  const deliveryLine = [item.delivery?.title, item.delivery?.subtitle]
    .filter(Boolean)
    .join(', ')

  const base = {
    id: item.id,
    title: item.title,
    status: item.status,
    auctionId: referenceId,
    auctionDate: 'May 18, 2026',
    deliveryCharge: '$2000.00',
    customer: {
      ...MOCK_CUSTOMER,
      deliveryAddress:
        item.id === 'dl-001'
          ? MOCK_CUSTOMER.deliveryAddress
          : deliveryLine || MOCK_CUSTOMER.deliveryAddress,
    },
    transporter: MOCK_TRANSPORTER,
    shipping: {
      pickupLocation:
        item.id === 'dl-001'
          ? 'Ambuja Cement Factory, Kalyan'
          : pickupLine || item.pickup?.title,
      unloadingInstructions:
        item.id === 'dl-001'
          ? 'Metro Construction Site, Andheri West'
          : deliveryLine || item.delivery?.title,
      accessCondition: 'Loading dock with ramp',
      additionalNotes:
        'Delivery must be coordinated with site manager. Contact 24 hours before arrival.',
    },
    product:
      item.id === 'dl-001'
        ? {
            name: 'Heavy Machinery - Excavator',
            sku: 'EXC-HD-2024',
            quantity: '500 bags (50kg each)',
            weight: '25000 kg',
            price: '$85,000',
          }
        : {
            name: item.title,
            sku: 'EXC-HD-2024',
            quantity: item.title.toLowerCase().includes('cement')
              ? '500 bags (50kg each)'
              : '1 unit',
            weight: '25000 kg',
            price: item.price || '$85,000',
          },
  }

  return base
}
