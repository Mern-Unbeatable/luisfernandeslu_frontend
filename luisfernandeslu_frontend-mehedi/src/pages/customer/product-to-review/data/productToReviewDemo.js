export const PRODUCTS_TO_REVIEW_DEMO = [
  {
    id: 'portland-cement-50kg-grade-a',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    title: 'Premium Portland Cement (50kg) Grade A',
    description: 'building cement for structural construction.',
    shippingStatus: 'delivered',
  },
  {
    id: 'clay-bricks-premium',
    image:
      'https://images.unsplash.com/photo-1615876230916-2a0276a30863?w=400&h=400&fit=crop',
    title: 'Premium Clay Red Bricks',
    description: 'Durable clay bricks for masonry walls and facades.',
    shippingStatus: 'delivered',
  },
  {
    id: 'river-sand-truckload',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
    title: 'Fine Grain River Sand (Truckload)',
    description: 'Clean river sand for concrete and plaster mixes.',
    shippingStatus: 'delivered',
  },
]

export function getProductToReview(reviewId) {
  return PRODUCTS_TO_REVIEW_DEMO.find((item) => item.id === reviewId) ?? null
}
