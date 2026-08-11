export const FINANCE_STATS = {
  totalRevenue: '€479,100',
  commissionRevenue: '€38,328',
  pendingPayouts: '€263,500',
  marketingRevenue: '€323,500',
}

export const FINANCE_CHART_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Y-axis 0–80k; shapes match Finance & Payments revenue trend mock. */
export const FINANCE_COMMISSION_SERIES = [
  22000, 26000, 24000, 31000, 38000, 41000, 46000, 52000, 56000, 68000, 62000,
  40000,
]

export const FINANCE_MARKETING_SERIES = [
  42000, 30000, 27000, 34000, 52000, 58000, 53000, 49000, 43000, 36000, 28000,
  24000,
]

export const FINANCE_PAYOUTS = [
  {
    id: 'p1',
    name: 'Rajesh Kumar',
    email: 'rajesh@rk.com',
    totalEarnings: 28500,
    requested: 48500,
    pending: 20000,
    requestDate: '1/20/2026',
    status: 'paid',
  },
  {
    id: 'p2',
    name: 'Aisha Verma',
    email: 'verma@freight.com',
    totalEarnings: 27200,
    requested: 37200,
    pending: 10000,
    requestDate: '2/20/2026',
    status: 'rejected',
  },
  {
    id: 'p3',
    name: 'Priya Nair',
    email: 'priya1@ikl.com',
    totalEarnings: 26500,
    requested: 42500,
    pending: 26500,
    requestDate: '3/20/2026',
    status: 'approved',
  },
  {
    id: 'p4',
    name: 'Carlos Mendes',
    email: 'carlos.m@haul.pt',
    totalEarnings: 31200,
    requested: 41200,
    pending: 15000,
    requestDate: '4/12/2026',
    status: 'pending',
  },
  {
    id: 'p5',
    name: 'Jenny Wilson',
    email: 'jenny.w@logistics.com',
    totalEarnings: 29800,
    requested: 39800,
    pending: 12000,
    requestDate: '5/8/2026',
    status: 'paid',
  },
  {
    id: 'p6',
    name: 'Omar Hassan',
    email: 'omar.h@freight.io',
    totalEarnings: 24100,
    requested: 34100,
    pending: 18000,
    requestDate: '6/2/2026',
    status: 'pending',
  },
  {
    id: 'p7',
    name: 'Elena Rossi',
    email: 'elena.r@trans.eu',
    totalEarnings: 33400,
    requested: 43400,
    pending: 9000,
    requestDate: '6/18/2026',
    status: 'approved',
  },
  {
    id: 'p8',
    name: 'Tomás Silva',
    email: 'tomas.s@cargo.pt',
    totalEarnings: 27600,
    requested: 37600,
    pending: 22000,
    requestDate: '7/1/2026',
    status: 'rejected',
  },
  {
    id: 'p9',
    name: 'Maria Santos',
    email: 'maria.s@move.pt',
    totalEarnings: 30100,
    requested: 40100,
    pending: 11000,
    requestDate: '7/15/2026',
    status: 'paid',
  },
]

export const FINANCE_COMMISSION_INVOICES = [
  {
    id: 'ci1',
    invoiceId: 'CI-01063',
    userType: 'supplier',
    orderId: 'ORD-001',
    participant: 'Jenny Wilson',
    amount: 285,
    date: '2026-01-15',
  },
  {
    id: 'ci2',
    invoiceId: 'CI-01064',
    userType: 'factory',
    orderId: 'ORD-002',
    participant: 'BuildCo Factory',
    amount: 420,
    date: '2026-01-18',
  },
  {
    id: 'ci3',
    invoiceId: 'CI-01065',
    userType: 'transporter',
    orderId: 'ORD-003',
    participant: 'Rajesh Kumar',
    amount: 195,
    date: '2026-01-20',
  },
  {
    id: 'ci4',
    invoiceId: 'CI-01066',
    userType: 'supplier',
    orderId: 'ORD-004',
    participant: 'SteelMart Ltd',
    amount: 510,
    date: '2026-02-02',
  },
  {
    id: 'ci5',
    invoiceId: 'CI-01067',
    userType: 'factory',
    orderId: 'ORD-005',
    participant: 'Porto Mix Plant',
    amount: 380,
    date: '2026-02-10',
  },
  {
    id: 'ci6',
    invoiceId: 'CI-01068',
    userType: 'transporter',
    orderId: 'ORD-006',
    participant: 'Aisha Verma',
    amount: 240,
    date: '2026-02-14',
  },
  {
    id: 'ci7',
    invoiceId: 'CI-01069',
    userType: 'supplier',
    orderId: 'ORD-007',
    participant: 'BrickWorks SA',
    amount: 325,
    date: '2026-02-22',
  },
  {
    id: 'ci8',
    invoiceId: 'CI-01070',
    userType: 'factory',
    orderId: 'ORD-008',
    participant: 'Lisbon Prefab',
    amount: 460,
    date: '2026-03-01',
  },
  {
    id: 'ci9',
    invoiceId: 'CI-01071',
    userType: 'transporter',
    orderId: 'ORD-009',
    participant: 'Priya Nair',
    amount: 210,
    date: '2026-03-05',
  },
]

export function formatFinanceCurrency(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return `€${n.toLocaleString('en-US', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

export function filterPayoutsByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

export function filterPayoutsBySearch(rows, query) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q) return rows
  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q),
  )
}

export function filterInvoicesByUserType(rows, userType) {
  if (!userType || userType === 'all') return rows
  return rows.filter(
    (row) =>
      String(row.userType).toLowerCase() === String(userType).toLowerCase(),
  )
}

export function filterInvoicesBySearch(rows, query) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q) return rows
  return rows.filter(
    (row) =>
      row.invoiceId.toLowerCase().includes(q) ||
      row.orderId.toLowerCase().includes(q) ||
      row.participant.toLowerCase().includes(q),
  )
}
