function normalizeReturnStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
}

/** Map backend return order list row */
export function mapCustomerReturnOrder(order) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.date,
    status: normalizeReturnStatus(order.status),
    itemCount: order.itemCount ?? 0,
    thumbnails: order.thumbnails ?? [],
  }
}

/** Map backend return order detail */
export function mapCustomerReturnOrderDetail(data) {
  if (!data) return null

  return {
    id: data.id,
    orderNumber: data.orderNumber,
    placedDate: data.placedDate,
    status: normalizeReturnStatus(data.status),
    items: (data.items ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      returnId: item.returnId || undefined,
    })),
  }
}

/** Map backend return request list row */
export function mapCustomerReturnRequest(request) {
  return {
    id: request.id,
    displayId: request.displayId ?? request.id,
    title: request.title,
    reason: request.reason,
    status: normalizeReturnStatus(request.status),
    updatedAt: request.updatedAt,
    image: request.image,
  }
}

/** Map backend return request detail */
export function mapCustomerReturnRequestDetail(data) {
  if (!data) return null

  return {
    id: data.id,
    displayId: data.displayId ?? data.id,
    status: normalizeReturnStatus(data.status),
    submittedOn: data.submittedOn,
    reason: data.reason,
    description: data.description,
    evidence: data.evidence ?? [],
    product: data.product,
    timeline: data.timeline ?? [],
  }
}
