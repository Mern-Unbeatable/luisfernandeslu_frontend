import { DEMO_PRODUCT } from '@/data/demoData'
import { LISTING_TEMPLATES } from './productsListing'

export function normalizeProductSlug(param = '') {
  return param.replace(/-\d+$/, '')
}

function formatDetailPrice(priceText, priceValue) {
  if (priceText) {
    const cleaned = priceText.replace(/^Price:\s*/i, '').trim()
    const match = cleaned.match(/^\$?([\d.]+)\s*(?:per\s+(.+))?$/i)
    if (match) {
      const amount = `$${match[1]}`
      const unit = match[2]
      return unit ? `${amount} Per ${unit}` : amount
    }
    return cleaned
  }
  if (priceValue != null) return `$${priceValue}.00`
  return DEMO_PRODUCT.priceText
}

/**
 * Mock PDP payload for ProductDetails (API-ready shape).
 */
export function getProductDetailBySlug(rawSlug) {
  const slug = normalizeProductSlug(rawSlug)
  const template = LISTING_TEMPLATES.find((item) => item.slug === slug)
  if (!template) return null

  if (slug === 'portland-cement-quick-set') {
    return {
      ...DEMO_PRODUCT,
      title: template.title,
      images: [template.image, ...DEMO_PRODUCT.images.slice(1)],
      seller: {
        ...DEMO_PRODUCT.seller,
        name: 'R2A Store',
      },
    }
  }

  const priceText = formatDetailPrice(template.priceText, template.priceValue)

  return {
    ...DEMO_PRODUCT,
    title: template.title,
    sku: `A${String(template.priceValue).padStart(6, '0').slice(0, 6)}`,
    category: 'Building Materials',
    priceText,
    price: `$${template.priceValue}.00`,
    images: [template.image, template.image, template.image, template.image],
    descriptionParagraphs: [
      template.description,
      ...DEMO_PRODUCT.descriptionParagraphs.slice(1),
    ],
    seller: {
      ...DEMO_PRODUCT.seller,
      name: 'R2A Store',
    },
  }
}
