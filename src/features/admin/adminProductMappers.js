/** UI tab → API approvalStatus filter */
export function toAdminProductStatusParam(tabId) {
  if (tabId === 'pending') return 'PENDING_REVIEW'
  if (tabId === 'accepted') return 'APPROVED'
  if (tabId === 'rejected') return 'REJECTED'
  return 'all'
}

/** API card status label → ProductCard status prop */
export function toProductCardStatus(apiStatus) {
  const value = String(apiStatus || '').toLowerCase()
  if (value === 'pending' || value === 'pending_review') return 'pending'
  if (value === 'approved' || value === 'active' || value === 'accepted') {
    return 'active'
  }
  if (value === 'rejected') return 'rejected'
  if (value === 'draft') return 'pending'
  return value || 'pending'
}

function formatUnit(unitOfMeasure, weightKg) {
  if (!unitOfMeasure) return ''
  if (weightKg != null && weightKg !== '') {
    return `${unitOfMeasure} (${weightKg} kg)`
  }
  return String(unitOfMeasure)
}

/** Map /api/admin/products card → ProductCard product prop */
export function mapAdminModerationCard(product) {
  const price = Number(product.basePrice)
  const priceLabel = Number.isFinite(price)
    ? `€${price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    : product.basePrice != null
      ? String(product.basePrice)
      : '—'
  const unit = formatUnit(product.unitOfMeasure, product.weightKg)

  return {
    id: product.id,
    status: toProductCardStatus(product.status),
    card: {
      image: product.image || '',
      title: product.name || product.title || '—',
      description: product.description || '',
      price: priceLabel,
      priceText: unit ? `Price: ${priceLabel} per ${unit}` : `Price: ${priceLabel}`,
      unit,
    },
  }
}
