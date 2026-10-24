function formatPlanPrice(price) {
  if (price == null || price === '') return '—'
  const num = Number(price)
  if (Number.isNaN(num)) return String(price)

  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** Map backend promotion plan → UI shape */
export function mapAdminPromotionPlan(plan) {
  return {
    id: plan.id,
    label: plan.label,
    durationDays: plan.durationDays,
    price: plan.price,
    currency: 'EUR',
    priceDisplay: formatPlanPrice(plan.price),
    isActive: Boolean(plan.isActive),
    sortOrder: plan.sortOrder,
  }
}
