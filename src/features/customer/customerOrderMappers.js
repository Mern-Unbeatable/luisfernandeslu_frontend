function formatOrderPrice(price) {
  if (price == null || price === '') return '—'
  const num = Number(price)
  if (Number.isNaN(num)) return String(price)

  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function formatTimelineDate(value) {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatProductQuantity(product) {
  const quantity = product.quantity ?? '—'
  const unit = product.unit ? ` ${product.unit}` : ''
  const weight =
    product.weightKg != null && product.weightKg !== ''
      ? ` (${product.weightKg} kg)`
      : ''

  return `${quantity}${unit}${weight}`.trim()
}

function mapShippingAddress(shippingAddress = {}) {
  return {
    name: shippingAddress.name,
    lines: shippingAddress.lines ?? [],
    phone: shippingAddress.phone,
  }
}

function mapDriver(driver) {
  if (!driver) return null

  return {
    name: driver.name,
    vehicle: driver.vehicle,
    phone: driver.phone,
  }
}

function mapTimeline(timeline = []) {
  return timeline.map((step) => ({
    id: step.id,
    label: step.label,
    date: formatTimelineDate(step.at),
    completed: Boolean(step.completed),
  }))
}

function normalizeOrderStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
}

export function mapCustomerOrderActions(apiActions) {
  if (!apiActions) return []

  const actions = []

  if (apiActions.canCancel) {
    actions.push({
      id: 'cancel',
      labelKey: 'buyerOrders.cancelOrder',
      variant: 'danger',
    })
  }

  if (apiActions.canTrack) {
    actions.push({
      id: 'track',
      labelKey: 'buyerOrders.trackOrder',
      variant: 'primary',
    })
  }

  if (apiActions.canReview) {
    actions.push({
      id: 'review',
      labelKey: 'buyerOrders.writeReview',
      variant: 'danger',
    })
  }

  if (apiActions.canDownloadInvoice) {
    actions.push({
      id: 'downloadInvoice',
      labelKey: 'buyerOrders.downloadInvoice',
      variant: 'primary',
    })
  }

  return actions
}

/** Map backend customer order list row → BuyerOrderCard shape */
export function mapCustomerOrder(order) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: normalizeOrderStatus(order.status),
    orderStatus: order.orderStatus,
    image: order.image,
    title: order.title,
    description: order.description,
    priceDisplay: formatOrderPrice(order.price),
    hasInvoice: Boolean(order.hasInvoice),
    invoiceId: order.invoiceId,
    actions: mapCustomerOrderActions(order.actions),
    createdAt: order.createdAt,
  }
}

/** Map backend customer order detail → BuyerOrderInformation shape */
export function mapCustomerOrderDetail(data) {
  const order = data?.order ?? data
  if (!order) return null

  const shippingAddress = order.shippingAddress ?? {}

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: normalizeOrderStatus(order.status),
    orderStatus: order.orderStatus,
    shippingAddress: mapShippingAddress(shippingAddress),
    lineItems: (order.products ?? []).map((product) => ({
      id: product.id,
      productId: product.productId,
      name: product.name,
      quantity: formatProductQuantity(product),
      price: formatOrderPrice(product.price),
    })),
    totalDisplay: formatOrderPrice(order.total),
    subTotalDisplay: formatOrderPrice(order.subTotal),
    shippingFeeDisplay: formatOrderPrice(order.shippingFee),
    vatAmountDisplay: formatOrderPrice(order.vatAmount),
    discountAmountDisplay: formatOrderPrice(order.discountAmount),
    driver: mapDriver(order.driver),
    progressSteps: mapTimeline(order.timeline),
    hasInvoice: Boolean(order.hasInvoice),
    invoice: order.invoice,
    cancellationReason: order.cancellationReason,
    deliveryOtp: order.deliveryOtp,
    actions: order.actions,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
}

/** Map backend customer order tracking → BuyerOrderInformation tracking fields */
export function mapCustomerOrderTrack(data) {
  const order = data?.order ?? data
  if (!order) return null

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: normalizeOrderStatus(order.status),
    orderStatus: order.orderStatus,
    shippingAddress: mapShippingAddress(order.shippingAddress),
    driver: mapDriver(order.driver),
    progressSteps: mapTimeline(order.timeline),
    deliveryOtp: order.deliveryOtp,
  }
}
