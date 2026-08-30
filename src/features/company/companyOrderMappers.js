function normalizeCompanyOrderStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
}

function formatOrderPrice(price) {
  if (price == null || price === '') return '—'
  const num = Number(price)
  if (Number.isNaN(num)) return String(price)

  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function formatProgressDate(value) {
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

function mapProgressSteps(steps = []) {
  return steps.map((step) => ({
    id: step.id,
    label: step.label,
    date: formatProgressDate(step.at),
    completed: Boolean(step.completed),
  }))
}

function mapPayment(payment) {
  if (!payment) return null

  return {
    payNow: formatOrderPrice(payment.payNow),
    remaining: formatOrderPrice(payment.remaining),
    note: payment.note || undefined,
  }
}

function mapDriver(driver) {
  if (!driver) return null

  return {
    id: driver.id,
    name: driver.name,
    vehicle: driver.vehicle,
    phone: driver.phone,
  }
}

/** Map backend company order list row */
export function mapCompanyOrder(order) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    productName: order.productName,
    quantity: order.quantity,
    quantityLabel: order.quantityLabel,
    unit: order.unit,
    status: normalizeCompanyOrderStatus(order.status),
    orderStatus: order.orderStatus,
    projectName: order.projectName,
    projectAddress: order.projectAddress,
    createdAt: order.createdAt,
  }
}

/** Map backend company order detail */
export function mapCompanyOrderDetail(data) {
  const order = data?.order ?? data
  if (!order) return null

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: normalizeCompanyOrderStatus(order.status),
    orderStatus: order.orderStatus,
    productName: order.productName,
    quantity: order.quantity,
    quantityLabel: order.quantityLabel,
    unit: order.unit,
    projectName: order.projectName,
    deliveryLocation: order.deliveryLocation,
    totalPrice: formatOrderPrice(order.total),
    installmentLabel: order.installmentMonths
      ? `${order.installmentMonths} months`
      : '—',
    payment: mapPayment(order.payment),
    unloadingType: order.unloadingType,
    accessConditions: order.accessConditions,
    driver: mapDriver(order.driver),
    progressSteps: mapProgressSteps(order.progressSteps),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
}
