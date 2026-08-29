function normalizeShippingStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
}

/** Map backend pending review product → ProductReviewRow shape */
export function mapCustomerPendingReview(product) {
  return {
    id: product.id,
    orderId: product.orderId,
    orderNumber: product.orderNumber,
    productId: product.productId,
    image: product.image,
    title: product.title,
    description: product.description,
    shippingStatus: normalizeShippingStatus(product.shippingStatus),
    orderStatus: product.orderStatus,
    deliveredAt: product.deliveredAt,
  }
}
