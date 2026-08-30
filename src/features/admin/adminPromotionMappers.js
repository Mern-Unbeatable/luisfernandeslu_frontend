function formatPromotionCurrency(amount, currency) {
  if (amount == null || amount === '') return '—'
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)

  if (currency === 'EUR') {
    return `€${num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`
  }

  if (currency === 'USD') {
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`
  }

  return `${currency} ${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function formatPromotionUnit(unitOfMeasure, weightKg) {
  if (!unitOfMeasure) return ''
  if (weightKg != null && weightKg !== '') {
    return `${unitOfMeasure} (${weightKg} kg)`
  }
  return unitOfMeasure
}

/** Map backend promotion → marketing card row */
export function mapAdminPromotion(promotion) {
  const currency = promotion.currency || 'USD'
  const unit = formatPromotionUnit(
    promotion.unitOfMeasure,
    promotion.weightKg,
  )
  const priceFormatted = formatPromotionCurrency(
    promotion.basePrice,
    currency,
  )

  return {
    id: promotion.id,
    status: String(promotion.status || '')
      .trim()
      .toLowerCase(),
    boostTier: formatPromotionCurrency(promotion.boostTier, currency),
    duration:
      promotion.durationDays != null
        ? `${promotion.durationDays} Days`
        : '—',
    isFeatured: Boolean(promotion.isFeatured),
    card: {
      image: promotion.image,
      title: promotion.name,
      description: promotion.description,
      price: priceFormatted,
      priceText: unit
        ? `Price: ${priceFormatted} per ${unit}`
        : `Price: ${priceFormatted}`,
      unit,
      timeLeft: promotion.timeLeft || undefined,
      expiryDate: promotion.endDate || undefined,
    },
  }
}
