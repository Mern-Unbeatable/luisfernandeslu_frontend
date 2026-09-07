function formatCount(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return number.toLocaleString('en-IE')
}

function formatMoney(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return `€${number.toLocaleString('en-IE', {
    minimumFractionDigits: number % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function mapRevenuePoints(points) {
  if (!Array.isArray(points)) return Array.from({ length: 12 }, () => 0)
  return points.map((point) => {
    if (typeof point === 'number') return Number.isFinite(point) ? point : 0
    const value = Number(point?.value ?? point?.amount ?? point?.y ?? 0)
    return Number.isFinite(value) ? value : 0
  })
}

export function mapTransporterDashboard(data) {
  const stats = data?.stats || {}
  const actions = data?.actions || {}
  const revenue = data?.revenue || {}
  const values = mapRevenuePoints(revenue.points)
  const maxFromApi = Number(revenue.maxValue)
  const maxValue =
    Number.isFinite(maxFromApi) && maxFromApi > 0
      ? maxFromApi
      : Math.max(...values, 1)
  const yTicks = (Array.isArray(revenue.yTicks) ? revenue.yTicks : [])
    .map(Number)
    .filter((n) => Number.isFinite(n))

  return {
    welcomeName: data?.welcomeName || '',
    stats: {
      activeAuctions: formatCount(stats.activeAuctions),
      wonDeliveries: formatCount(stats.wonDeliveries),
      inTransit: formatCount(stats.inTransit),
      completedToday: formatCount(stats.completedToday),
      todaysEarnings: formatMoney(stats.todaysEarnings),
      pendingEarnings: formatMoney(stats.pendingEarnings),
    },
    actions: {
      activeAuctions: Number(actions.activeAuctions) || 0,
      activeDeliveries: Number(actions.activeDeliveries) || 0,
      availablePayout: formatMoney(actions.availablePayout),
      availablePayoutRaw: Number(actions.availablePayout) || 0,
    },
    revenue: {
      period: revenue.period || 'thisYear',
      year: Number(revenue.year) || new Date().getFullYear(),
      values,
      maxValue,
      yTicks,
    },
  }
}
