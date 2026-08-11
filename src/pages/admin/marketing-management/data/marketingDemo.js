const CARD_IMG =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'

const CARD_DESCRIPTION =
  'High-strength building cement suitable for construction and masonry work.'

const TITLES = [
  'Portland Cement',
  'Portland Cement Quick Set',
  'UltraSet Portland Cement',
  'Premium Portland Cement',
]

function buildCard(index, price = 115) {
  return {
    image: CARD_IMG,
    title: TITLES[index % TITLES.length],
    description: CARD_DESCRIPTION,
    price: `€${price}`,
    priceText: `Price: €${price} per bag (50 kg)`,
    unit: 'bag (50 kg)',
  }
}

export const MARKETING_STATS = {
  totalRevenue: '€2,840',
  pendingRequests: 7,
  activeBoosts: 12,
  totalFeatured: 29,
}

export const MARKETING_TABS = [
  { id: 'all', labelKey: 'adminMarketingManagement.tabs.all' },
  { id: 'pending', labelKey: 'adminMarketingManagement.tabs.pending' },
  { id: 'active', labelKey: 'adminMarketingManagement.tabs.active' },
  { id: 'completed', labelKey: 'adminMarketingManagement.tabs.completed' },
]

const BOOST_TIERS = ['€40', '€55', '€70', '€40']
const DURATIONS = ['7 Days', '14 Days', '7 Days', '30 Days']

function buildRequests(count, status) {
  return Array.from({ length: count }, (_, index) => ({
    id: `req-${status}-${index + 1}`,
    status,
    boostTier: BOOST_TIERS[index % BOOST_TIERS.length],
    duration: DURATIONS[index % DURATIONS.length],
    card: buildCard(index, 105 + (index % 5) * 5),
  }))
}

export const MARKETING_BOOST_REQUESTS = [
  ...buildRequests(8, 'pending'),
  ...buildRequests(4, 'active'),
  ...buildRequests(4, 'completed'),
]

export const MARKETING_FEATURED_PRODUCTS = Array.from({ length: 8 }, (_, index) => ({
  id: `feat-${index + 1}`,
  card: {
    ...buildCard(index, 115 + index),
    timeLeft: `${5 + (index % 3)} days left`,
  },
}))

export function countMarketingRequests(requests) {
  return requests.reduce(
    (acc, row) => {
      acc.all += 1
      if (row.status === 'pending') acc.pending += 1
      if (row.status === 'active') acc.active += 1
      if (row.status === 'completed') acc.completed += 1
      return acc
    },
    { all: 0, pending: 0, active: 0, completed: 0 },
  )
}

export function filterMarketingRequests(requests, tabId) {
  if (tabId === 'pending') {
    return requests.filter((row) => row.status === 'pending')
  }
  if (tabId === 'active') {
    return requests.filter((row) => row.status === 'active')
  }
  if (tabId === 'completed') {
    return requests.filter((row) => row.status === 'completed')
  }
  return requests
}
