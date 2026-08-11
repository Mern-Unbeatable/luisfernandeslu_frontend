import { DEMO_DISPUTE_PUBLIC } from '@/data/demoData'

const GRAVEL_IMG =
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80'
const ROOF_IMG =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
const PAINT_IMG =
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=200&q=80'
const BLOCK_IMG =
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=200&q=80'
const GLASS_IMG =
  'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=200&q=80'
const BRICK_IMG = '/images/categories/red_bricks_real.png'
const EVIDENCE_IMG =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80'

export const DISPUTES_STATS = {
  total: 2,
  pendingAction: 1,
  underReview: 1,
  resolved: 0,
}

export const DISPUTES_LIST = [
  {
    id: 'disp-001',
    displayId: 'DISP-001',
    orderId: 'ORD-5521',
    orderDate: '3/15/2024',
    status: 'under_review',
    title: 'Crushed Grey Stone Chips ba Grey Granite Gravel',
    highlight: 'Premium Grey Granite Gravel for Landscaping',
    description:
      'Premium grey granite gravel is a versatile and durable material ideal for landscaping, driveways, and decorative garden features.',
    image: GRAVEL_IMG,
    seller: 'Tech Haven',
    messageCount: 3,
  },
  {
    id: 'disp-002',
    displayId: 'DISP-002',
    orderId: 'ORD-5521',
    orderDate: '3/15/2024',
    status: 'pending',
    title: 'Crushed Grey Stone Chips ba Grey Granite Gravel',
    highlight: 'Premium Grey Granite Gravel for Landscaping',
    description:
      'Premium grey granite gravel is a versatile and durable material ideal for landscaping, driveways, and decorative garden features.',
    image: ROOF_IMG,
    seller: 'Tech Haven',
    messageCount: 1,
  },
]

export const DISPUTE_DETAILS = {
  'disp-001': {
    ...DEMO_DISPUTE_PUBLIC,
    id: 'disp-001',
    displayId: 'DISP-001',
  },
  'disp-002': {
    ...DEMO_DISPUTE_PUBLIC,
    id: 'disp-002',
    displayId: 'DISP-002',
    status: 'pending',
    items: DEMO_DISPUTE_PUBLIC.items.slice(0, 1),
  },
}

export function getDisputeDetail(disputeId) {
  return DISPUTE_DETAILS[disputeId] ?? null
}

export const DISPUTE_ORDER_OPTIONS = [
  { value: 'ORD-5521', label: 'ORD-5521 — Portland Cement (Delivered)' },
  { value: 'ORD-101', label: 'ORD-101 — Automatic Corner Paint Roller' },
  { value: 'ORD-004', label: 'ORD-004 — Steel Rebar' },
]

export const RETURN_ORDERS_LIST = [
  {
    id: 'ord-101',
    orderNumber: 'ord-101',
    date: '4/1/2026',
    status: 'delivered',
    itemCount: 2,
    thumbnails: [PAINT_IMG, BLOCK_IMG],
  },
  {
    id: 'ord-102',
    orderNumber: 'ord-102',
    date: '3/28/2026',
    status: 'delivered',
    itemCount: 1,
    thumbnails: [BLOCK_IMG],
  },
]

export const RETURN_ORDER_DETAILS = {
  'ord-101': {
    id: 'ord-101',
    orderNumber: 'ord-101',
    placedDate: '4/1/2026',
    status: 'delivered',
    items: [
      {
        id: 'li-1',
        title: 'Automatic Corner Paint Roller',
        quantity: 1,
        price: '€299.99',
        image: PAINT_IMG,
        returnId: 'ret-002',
      },
      {
        id: 'li-2',
        title: 'Precast Concrete Building Blocks',
        quantity: 1,
        price: '€299.99',
        image: BLOCK_IMG,
      },
    ],
  },
  'ord-102': {
    id: 'ord-102',
    orderNumber: 'ord-102',
    placedDate: '3/28/2026',
    status: 'delivered',
    items: [
      {
        id: 'li-3',
        title: 'Precast Concrete Building Blocks',
        quantity: 2,
        price: '€199.50',
        image: BLOCK_IMG,
      },
    ],
  },
}

export function getReturnOrderDetail(orderId) {
  return RETURN_ORDER_DETAILS[orderId] ?? null
}

export const RETURN_REQUESTS_LIST = [
  {
    id: 'ret-001',
    displayId: 'ret-001',
    title: 'Tempered Glass Panels',
    reason: 'Damaged',
    status: 'pending',
    updatedAt: '4/8/2026',
    image: GLASS_IMG,
  },
  {
    id: 'ret-002',
    displayId: 'ret-002',
    title: 'Automatic Corner Paint Roller',
    reason: 'Damaged',
    status: 'under_review',
    updatedAt: '4/8/2026',
    image: PAINT_IMG,
  },
  {
    id: 'ret-003',
    displayId: 'ret-003',
    title: 'Premium Red Clay Bricks',
    reason: 'Damaged',
    status: 'pending',
    updatedAt: '4/8/2026',
    image: BRICK_IMG,
  },
]

export const RETURN_REQUEST_DETAILS = {
  'ret-001': {
    id: 'ret-001',
    displayId: 'ret-001',
    status: 'pending',
    submittedOn: '4/5/2026',
    reason: 'Damaged',
    description:
      'The top glass panel arrived with a visible crack along the edge, and the surface has multiple scratches that make it unsafe for installation.',
    evidence: [EVIDENCE_IMG],
    product: {
      title: 'Tempered Glass Panels',
      orderId: 'ord-101',
      image: GLASS_IMG,
    },
    timeline: [
      {
        status: 'pending',
        date: '4/5/2026, PM',
        actor: 'BUYER',
      },
    ],
  },
  'ret-002': {
    id: 'ret-002',
    displayId: 'ret-002',
    status: 'under_review',
    submittedOn: '4/3/2026',
    reason: 'Damaged',
    description:
      'Several bricks in the shipment were chipped and unusable for the exterior wall we are building.',
    evidence: [BRICK_IMG],
    product: {
      title: 'Automatic Corner Paint Roller',
      orderId: 'ord-101',
      image: PAINT_IMG,
    },
    timeline: [
      {
        status: 'under_review',
        date: '4/4/2026, PM',
        actor: 'SELLER',
      },
      {
        status: 'pending',
        date: '4/3/2026, PM',
        actor: 'BUYER',
      },
    ],
  },
}

export function getReturnRequestDetail(returnId) {
  return RETURN_REQUEST_DETAILS[returnId] ?? null
}
