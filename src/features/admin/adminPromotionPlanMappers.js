function formatPlanPrice(price, currency) {
  if (price == null || price === '') return '—'
  const num = Number(price)
  if (Number.isNaN(num)) return String(price)

  if (currency === 'EUR') {
    return `€${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  if (currency === 'USD') {
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return `${currency} ${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** Map backend promotion plan → UI shape */
export function mapAdminPromotionPlan(plan) {
  const currency = plan.currency || 'USD'

  return {
    id: plan.id,
    label: plan.label,
    durationDays: plan.durationDays,
    price: plan.price,
    currency,
    priceDisplay: formatPlanPrice(plan.price, currency),
    isActive: Boolean(plan.isActive),
    sortOrder: plan.sortOrder,
  }
}
