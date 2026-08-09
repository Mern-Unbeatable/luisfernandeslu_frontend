import { DEMO_DISPUTE_DASHBOARD } from '@/data/demoData'

export const ADMIN_DISPUTES = [
  {
    id: 'dis-001',
    disputeId: 'DIS-001',
    orderId: 'ORD-001',
    customer: 'Marvin McKinney',
    supplier: 'Wade Warren',
    issue: 'Damaged goods received',
    status: 'pending',
    registered: '2026-01-12',
  },
  {
    id: 'dis-002',
    disputeId: 'DIS-002',
    orderId: 'ORD-002',
    customer: 'Jenny Wilson',
    supplier: 'Robert Fox',
    issue: 'Late delivery — 5 days overdue',
    status: 'under_review',
    registered: '2026-01-18',
  },
  {
    id: 'dis-003',
    disputeId: 'DIS-003',
    orderId: 'ORD-003',
    customer: 'Cameron Williamson',
    supplier: 'Leslie Alexander',
    issue: 'Wrong item shipped',
    status: 'resolved',
    registered: '2026-01-22',
  },
  {
    id: 'dis-004',
    disputeId: 'DIS-004',
    orderId: 'ORD-004',
    customer: 'Eleanor Pena',
    supplier: 'Floyd Miles',
    issue: 'Missing items in order',
    status: 'pending',
    registered: '2026-02-01',
  },
  {
    id: 'dis-005',
    disputeId: 'DIS-005',
    orderId: 'ORD-005',
    customer: 'Jacob Jones',
    supplier: 'Kristin Watson',
    issue: 'Quality does not match listing',
    status: 'under_review',
    registered: '2026-02-08',
  },
  {
    id: 'dis-006',
    disputeId: 'DIS-006',
    orderId: 'ORD-006',
    customer: 'Courtney Henry',
    supplier: 'Devon Lane',
    issue: 'Invoice amount mismatch',
    status: 'resolved',
    registered: '2026-02-14',
  },
  {
    id: 'dis-007',
    disputeId: 'DIS-007',
    orderId: 'ORD-007',
    customer: 'Brooklyn Simmons',
    supplier: 'Theresa Webb',
    issue: 'Packaging severely damaged',
    status: 'pending',
    registered: '2026-02-20',
  },
  {
    id: 'dis-008',
    disputeId: 'DIS-008',
    orderId: 'ORD-008',
    customer: 'Alex Johnson',
    supplier: 'Tech Haven',
    issue: 'Product defect after installation',
    status: 'under_review',
    registered: '2026-03-02',
  },
]

export function filterDisputesByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

export function filterDisputesBySearch(rows, query) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q) return rows
  return rows.filter(
    (row) =>
      row.disputeId.toLowerCase().includes(q) ||
      row.orderId.toLowerCase().includes(q) ||
      row.customer.toLowerCase().includes(q) ||
      row.supplier.toLowerCase().includes(q) ||
      row.issue.toLowerCase().includes(q),
  )
}

export function getAdminDisputeRow(id) {
  return ADMIN_DISPUTES.find((row) => row.id === id) ?? null
}

export function getAdminDisputeDetail(id) {
  const row = getAdminDisputeRow(id)
  if (!row) return null

  const base = DEMO_DISPUTE_DASHBOARD

  return {
    ...base,
    id: row.id,
    status: row.status,
    createdAt: `${row.registered}, 2:10 PM`,
    items: [
      {
        id: 'di1',
        productName: 'Premium Marble Slabs',
        orderId: row.orderId,
        reason: row.issue.includes('Damaged') ? 'Damaged Item' : 'Order Issue',
        image: base.items[0]?.image,
      },
    ],
  }
}
