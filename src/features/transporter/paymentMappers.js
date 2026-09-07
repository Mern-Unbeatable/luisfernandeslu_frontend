function formatEuro(amount) {
  if (amount == null || amount === '') return '—'
  const value = Number(amount)
  if (!Number.isFinite(value)) return String(amount)

  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`
  }
  if (abs >= 10_000) {
    return `€${(value / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}K`
  }
  return `€${value.toLocaleString('en-IE', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function formatHistoryDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString()
}

function maskAccount(accountNumber) {
  const raw = String(accountNumber || '').trim()
  if (!raw) return '—'
  if (raw.length <= 4) return raw
  return `***${raw.slice(-4)}`
}

function normalizeHistoryType(type) {
  const raw = String(type || '')
    .trim()
    .toLowerCase()
  if (raw === 'withdrawal' || raw === 'payout' || raw === 'withdraw') {
    return 'withdrawal'
  }
  if (raw === 'delivery' || raw === 'earning' || raw === 'income') {
    return 'delivery'
  }
  return raw || 'withdrawal'
}

function pointValue(point) {
  if (typeof point === 'number') return point
  if (point == null || typeof point !== 'object') return 0
  const value = Number(
    point.value ?? point.amount ?? point.revenue ?? point.y ?? 0,
  )
  return Number.isFinite(value) ? value : 0
}

function pointMonthIndex(point, index) {
  if (typeof point === 'number') return index
  if (point == null || typeof point !== 'object') return index
  const month = Number(point.month ?? point.monthIndex ?? point.x)
  if (Number.isFinite(month) && month >= 1 && month <= 12) return month - 1
  if (Number.isFinite(month) && month >= 0 && month <= 11) return month
  return index
}

/** Map API revenue → chart series (12 months) */
export function mapRevenueSeries(revenue) {
  const year = Number(revenue?.year) || new Date().getFullYear()
  const points = Array.isArray(revenue?.points) ? revenue.points : []
  const values = Array.from({ length: 12 }, () => 0)

  points.forEach((point, index) => {
    const monthIndex = pointMonthIndex(point, index)
    if (monthIndex >= 0 && monthIndex < 12) {
      values[monthIndex] = pointValue(point)
    }
  })

  const yTicks = (Array.isArray(revenue?.yTicks) ? revenue.yTicks : [])
    .map(Number)
    .filter((n) => Number.isFinite(n))
  const maxFromApi = Number(revenue?.maxValue)
  const maxFromPoints = Math.max(0, ...values)
  const maxValue = Number.isFinite(maxFromApi) && maxFromApi > 0
    ? maxFromApi
    : Math.max(maxFromPoints, 1)

  return {
    year,
    values,
    maxValue,
    yTicks,
  }
}

export function mapPaymentStats(stats = {}) {
  const commission = Number(stats.adminCommissionPercent)
  return {
    totalEarnings: formatEuro(stats.totalEarnings),
    adminCommission:
      Number.isFinite(commission) ? `${commission}%` : '—',
    adminCommissionPercent: Number.isFinite(commission) ? commission : 0,
    availableBalance: formatEuro(stats.availableBalance),
    availableBalanceRaw: Number(stats.availableBalance) || 0,
    pendingEarnings: formatEuro(stats.pendingEarnings),
    monthlyAverage: formatEuro(stats.monthlyAverage),
  }
}

export function mapPaymentHistoryItem(item, index) {
  const type = normalizeHistoryType(item.type)
  const isWithdrawal = type === 'withdrawal'
  const amount = Number(item.amount) || 0
  const status = String(item.status || 'pending').toLowerCase()

  const accountLabel = item.accountType
    ? String(item.accountType).replace(/_/g, ' ')
    : 'Bank Transfer'
  const title = isWithdrawal
    ? `${accountLabel} to ${maskAccount(item.accountNumber)}`
    : item.title || item.productName || item.orderId || 'Delivery earning'

  return {
    id: item.id || `${item.date || 'row'}-${index}`,
    date: formatHistoryDate(item.date),
    title,
    type: isWithdrawal ? 'withdrawal' : type,
    orderId: item.orderId || item.accountNumber || item.reference || '—',
    status,
    amount: `${isWithdrawal || amount < 0 ? '-' : '+'}${formatEuro(Math.abs(amount))}`,
    isIncome: !isWithdrawal && amount >= 0,
    rawAmount: amount,
  }
}

export function mapPaymentsPayoutsResponse(data) {
  return {
    stats: mapPaymentStats(data?.stats),
    revenue: mapRevenueSeries(data?.revenue),
    history: (data?.paymentHistory || []).map(mapPaymentHistoryItem),
    pagination: data?.pagination || null,
  }
}
