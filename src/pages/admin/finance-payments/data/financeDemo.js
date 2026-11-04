import { appLocale } from '@/i18n/locale'

export const FINANCE_STATS = {
  totalRevenue: '€0',
  commissionRevenue: '€0',
  pendingPayouts: '€0',
  marketingRevenue: '€0',
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

export const FINANCE_PAYOUTS = []

export const FINANCE_COMMISSION_INVOICES = []

export function formatFinanceCurrency(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return `€${n.toLocaleString(appLocale(), {
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
