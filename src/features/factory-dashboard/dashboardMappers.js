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

function formatPercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return `${number}%`
}

function mapOrderStatusItems(items, t) {
  return (Array.isArray(items) ? items : []).map((item) => {
    const key = item.key || 'pending'
    return {
      key,
      value: Number(item.value) || 0,
      color: item.color || '#84CC16',
      label: t(`factoryDashboard.orderStatus.${key}`, {
        defaultValue: key,
      }),
    }
  })
}

export function mapFactoryDashboard(data, t) {
  const stats = data?.stats || {}
  const revenue = data?.revenue || {}
  const orderStatus = data?.orderStatus || {}

  const values = Array.isArray(revenue.values)
    ? revenue.values.map((value) => Number(value) || 0)
    : Array.isArray(revenue.months)
      ? revenue.months.map((month) => Number(month?.value) || 0)
      : Array.from({ length: 12 }, () => 0)

  const labelsFromApi = Array.isArray(revenue.months)
    ? revenue.months.map((month) => month?.month).filter(Boolean)
    : []

  const maxValue = Number(revenue.maxValue)
  const yTicks = (Array.isArray(revenue.yTicks) ? revenue.yTicks : [])
    .map(Number)
    .filter((n) => Number.isFinite(n))

  return {
    stats: {
      totalOrders: formatCount(stats.totalOrders),
      pendingOrders: formatCount(stats.pendingOrders),
      completedOrders: formatCount(stats.completedOrders),
      totalRevenue: formatMoney(stats.totalRevenue),
      adminCommission: formatPercent(stats.adminCommissionPercent),
      adminCommissionLabel:
        stats.adminCommissionLabel ||
        t('factoryDashboard.cards.adminCommissionDesc'),
    },
    revenue: {
      year: Number(revenue.year) || new Date().getFullYear(),
      labels: labelsFromApi,
      values,
      maxValue: Number.isFinite(maxValue) && maxValue > 0 ? maxValue : Math.max(...values, 1),
      yTicks,
    },
    orderStatus: {
      thisMonth: mapOrderStatusItems(orderStatus.thisMonth, t),
      thisWeek: mapOrderStatusItems(orderStatus.thisWeek, t),
    },
  }
}
