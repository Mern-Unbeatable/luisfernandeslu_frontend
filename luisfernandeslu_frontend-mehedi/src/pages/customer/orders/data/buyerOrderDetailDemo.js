/** Full order detail for track / order information screen (Figma CP-992841). */
export const DEMO_BUYER_ORDER_DETAIL = {
  orderNumber: 'CP-992841',
  status: 'processing',
  shippingAddress: {
    name: 'John Davidson',
    lines: [
      'House 24, Road 7, Construction Zone',
      'Dhaka, Bangladesh 1212',
      'United States',
    ],
    phone: 'Mobile: +1 (555) 123-4567',
  },
  lineItems: [
    {
      name: 'Premium Portland Cement (50kg)',
      quantity: '20 Bags',
      price: '€2,600',
    },
    {
      name: 'Fine Grain River Sand (Truckload)',
      quantity: '1 Unit',
      price: '€450',
    },
  ],
  totalDisplay: '€6,400',
  driver: {
    name: 'John Smith',
    vehicle: 'Truck #TR-4523',
    phone: '+1 (555) 123-4567',
  },
  progressSteps: [
    {
      id: 'confirmed',
      label: 'Order Confirmed',
      date: 'Apr 15, 10:00 AM',
      completed: true,
    },
    {
      id: 'dispatch',
      label: 'Ready for Dispatch',
      date: 'Apr 15, 2:00 PM',
      completed: true,
    },
    {
      id: 'picked',
      label: 'Picked Up',
      date: 'Apr 16, 8:00 AM',
      completed: true,
    },
    { id: 'transit', label: 'In Transit', completed: false },
    { id: 'delivered', label: 'Delivered', completed: false },
  ],
}

const DETAIL_ALIASES = {
  'CP-992841': DEMO_BUYER_ORDER_DETAIL,
  'ORD-CP2026-002': DEMO_BUYER_ORDER_DETAIL,
}

export function getBuyerOrderDetail(orderRef) {
  return DETAIL_ALIASES[orderRef] ?? null
}
