import { ADMIN_PRODUCT } from '@/data/demoData'

const CARD_IMG =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'

export const MODERATION_CATEGORIES = [
  { value: 'all', labelKey: 'adminProductModeration.filters.allCategories' },
  {
    value: 'building-materials',
    labelKey: 'adminProductModeration.filters.buildingMaterials',
  },
  {
    value: 'structural-steel',
    labelKey: 'adminProductModeration.filters.structuralSteel',
  },
  {
    value: 'masonry',
    labelKey: 'adminProductModeration.filters.masonry',
  },
  {
    value: 'electrical',
    labelKey: 'adminProductModeration.filters.electrical',
  },
]

const CARD_TITLES = [
  'Portland Cement',
  'Portland Cement Quick Set',
  'UltraSet Portland Cement',
  'Premium Portland Cement',
  'Industrial Steel Beams',
  'TMT Rebar Steel Rods',
  'Red Clay Modular Bricks',
  'Concrete Hollow Blocks',
]

const CARD_DESCRIPTION =
  'High-strength building cement suitable for construction and masonry work.'

function buildCardProduct(index) {
  const title = CARD_TITLES[index % CARD_TITLES.length]
  const price = 105 + (index % 7) * 5
  return {
    image: CARD_IMG,
    title,
    description: CARD_DESCRIPTION,
    price: `€${price}`,
    priceText: `Price: €${price} per bag (50 kg)`,
    unit: 'bag (50 kg)',
  }
}

const STATUS_SEQUENCE = [
  ...Array(8).fill('pending'),
  ...Array(8).fill('active'),
  ...Array(8).fill('rejected'),
]

const CATEGORY_SEQUENCE = [
  'building-materials',
  'structural-steel',
  'masonry',
  'building-materials',
  'electrical',
  'building-materials',
  'masonry',
  'structural-steel',
]

export const ADMIN_MODERATION_PRODUCTS = STATUS_SEQUENCE.map((status, index) => ({
  id: `mod-${index + 1}`,
  status,
  category: CATEGORY_SEQUENCE[index % CATEGORY_SEQUENCE.length],
  card: buildCardProduct(index),
}))

export function countModerationByStatus(products) {
  return products.reduce(
    (acc, row) => {
      acc.all += 1
      if (row.status === 'pending') acc.pending += 1
      if (row.status === 'active') acc.active += 1
      if (row.status === 'rejected') acc.rejected += 1
      return acc
    },
    { all: 0, pending: 0, active: 0, rejected: 0 },
  )
}

export function filterModerationProducts(products, { statusTab, category }) {
  return products.filter((row) => {
    const statusOk =
      statusTab === 'all' ||
      (statusTab === 'accepted' ? row.status === 'active' : row.status === statusTab)
    const categoryOk = category === 'all' || row.category === category
    return statusOk && categoryOk
  })
}

export function getModerationProductById(products, id) {
  return products.find((row) => row.id === id) ?? null
}

export function getModerationDetailProduct(row) {
  if (!row) return ADMIN_PRODUCT
  return {
    ...ADMIN_PRODUCT,
    title: row.card.title,
    sku: `MOD-${row.id.replace('mod-', '').padStart(4, '0')}`,
    images: ADMIN_PRODUCT.images?.length
      ? ADMIN_PRODUCT.images
      : row.card.image
        ? [row.card.image]
        : [],
    image: row.card.image || ADMIN_PRODUCT.images?.[0],
    priceText: row.card.priceText || ADMIN_PRODUCT.priceText,
    price: row.card.price || ADMIN_PRODUCT.price,
  }
}
