/** Demo auction detail payloads for supplier / factory / transporter views */

export const DEMO_AUCTION_DETAILS_ACTIVE = {
  id: 'auc-det-001',
  orderId: 'ORD-2026-002',
  auctionId: 'ORD-: AUC-001',
  auctionDate: 'May 18, 2026',
  pickupLocation: '890 Industrial Blvd, Houston, TX',
  deliveryCharge: '$2000.00',
  currentStatus: 'in-transit',
  status: 'active',
  customer: {
    name: 'Sarah Johnson',
    phone: '+1 (555) 234-5678',
    email: 'sarah.johnson@email.com',
    deliveryAddress: '2345 Commerce St, Dallas, TX 75201',
  },
  product: {
    name: 'Heavy Machinery - Excavator',
    sku: 'EXC-HD-2024',
    quantity: '500 bags (50kg each)',
    weight: '25000 kg',
    price: '$85,000',
  },
  shipping: {
    pickupLocation: 'Ambuja Cement Factory, Kalyan',
    unloadingInstructions: 'Metro Construction Site, Andheri West',
    accessCondition: 'Loading dock with ramp',
    additionalNotes:
      'Delivery must be coordinated with site manager. Contact 24 hours before arrival.',
  },
  bids: [
    {
      id: 'b1',
      transporterName: 'FastShip Logistics',
      at: '5/20/2026, 4:16:01 PM',
    },
    {
      id: 'b2',
      transporterName: 'QuickDelivery Express',
      at: '5/20/2026, 3:45:01 PM',
    },
    {
      id: 'b3',
      transporterName: 'BulkFreight Co',
      at: '5/20/2026, 2:30:01 PM',
    },
  ],
  transporter: null,
}

export const DEMO_AUCTION_DETAILS_ASSIGNED = {
  ...DEMO_AUCTION_DETAILS_ACTIVE,
  id: 'auc-det-002',
  status: 'assigned',
  currentStatus: 'in-transit',
  bids: [],
  transporter: {
    name: 'Swift Transport Co.',
    phone: '+1 (555) 987-6543',
    vehicleType: 'Heavy-duty flatbed truck',
    bidAmount: '$4,500',
    assignedAt: 'May 18, 2026 2:30 PM',
  },
}

/** Transporter view — assigned job. */
export const DEMO_AUCTION_DETAILS_TRANSPORTER = {
  ...DEMO_AUCTION_DETAILS_ACTIVE,
  id: 'auc-det-003',
  status: 'assigned',
  auctionId: 'ORD-: AUC-001',
  orderId: 'ORD-2026-002',
  deliveryCharge: '$2000.00',
  bids: [],
  transporter: {
    name: 'Swift Transport Co.',
    phone: '+1 (555) 987-6543',
    vehicleType: 'Heavy-duty flatbed truck',
    bidAmount: '$2000.00',
    assignedAt: 'May 18, 2026 2:30 PM',
  },
}

export const DEMO_AUCTION_DETAILS_TRANSPORTER_COMPLETE = {
  ...DEMO_AUCTION_DETAILS_TRANSPORTER,
  id: 'auc-det-004',
  status: 'complete',
  currentStatus: 'complete',
}
