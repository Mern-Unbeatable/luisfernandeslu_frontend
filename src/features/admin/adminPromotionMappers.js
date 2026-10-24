import i18n from '@/i18n'
import { appLocale } from '@/i18n/locale'

function formatPromotionCurrency(amount) {
  if (amount == null || amount === '') return '—'
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)

  return `€${num.toLocaleString(appLocale(), {
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
  const unit = formatPromotionUnit(
    promotion.unitOfMeasure,
    promotion.weightKg,
  )
  const priceFormatted = formatPromotionCurrency(promotion.basePrice)

  return {
    id: promotion.id,
    status: String(promotion.status || '')
      .trim()
      .toLowerCase(),
    boostTier: formatPromotionCurrency(promotion.boostTier),
    duration:
      promotion.durationDays != null
        ? i18n.t('fallback.daysCount', { count: promotion.durationDays })
        : '—',
    isFeatured: Boolean(promotion.isFeatured),
    card: {
      image: promotion.image,
      title: promotion.name,
      description: promotion.description,
      price: priceFormatted,
      priceText: unit
        ? i18n.t('fallback.pricePerUnitValue', { price: priceFormatted, unit })
        : i18n.t('fallback.priceValue', { price: priceFormatted }),
      unit,
      timeLeft: promotion.timeLeft || undefined,
      expiryDate: promotion.endDate || undefined,
    },
  }
}
