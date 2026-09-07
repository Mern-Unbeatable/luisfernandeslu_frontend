function normalizeDisputeStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
}

/** Map backend dispute stats */
export function mapCustomerDisputeStats(stats) {
  return {
    total: stats?.total ?? 0,
    pendingAction: stats?.pendingAction ?? 0,
    underReview: stats?.underReview ?? 0,
    resolved: stats?.resolved ?? 0,
  }
}

/** Map backend dispute list row */
export function mapCustomerDispute(dispute) {
  return {
    id: dispute.id,
    displayId: dispute.displayId ?? String(dispute.id || '').toUpperCase(),
    orderId: dispute.orderId,
    orderDate: dispute.orderDate,
    status: normalizeDisputeStatus(dispute.status),
    title: dispute.title,
    highlight: dispute.highlight,
    description: dispute.description,
    image: dispute.image,
    seller: dispute.seller,
    messageCount: dispute.messageCount ?? 0,
  }
}

/** Map backend dispute-eligible order for raise-dispute modal */
export function mapCustomerDisputeOrderOption(order) {
  return {
    value: order.orderNumber,
    label: `${order.orderNumber} — ${order.productName}`,
    orderNumber: order.orderNumber,
    productName: order.productName,
    image: order.image,
    seller: order.seller,
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      productName: item.productName,
      orderId: item.orderId,
      image: item.image,
    })),
  }
}

/** Map backend dispute detail */
export function mapCustomerDisputeDetail(data) {
  if (!data) return null

  return {
    id: data.id,
    orderId: data.orderId,
    status: normalizeDisputeStatus(data.status),
    createdAt: data.createdAt,
    description: data.description,
    items: (data.items ?? []).map((item) => ({
      id: item.id,
      productName: item.productName,
      orderId: item.orderId,
      reason: item.reason,
      image: item.image,
    })),
    evidence: data.evidence ?? [],
    chat: data.chat,
    messages: data.messages ?? [],
  }
}
