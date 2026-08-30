export const SUPPLIER_ORDER_STATUSES = [
  'new',
  'pending',
  'processing',
  'assigned',
  'completed',
  'cancel',
]

export const FACTORY_ORDER_STATUSES = [
  'in_production',
  'produced',
  'ready',
  'assigned',
  'completed',
  'cancel',
]

export function getAdminOrderStatusOptions(tab) {
  return tab === 'factory' ? FACTORY_ORDER_STATUSES : SUPPLIER_ORDER_STATUSES
}

export function getAdminOrderChangeableStatuses(tab, currentStatus) {
  const normalizedCurrent = normalizeOrderStatus(currentStatus)
  return getAdminOrderStatusOptions(tab).filter(
    (status) => status !== normalizedCurrent,
  )
}

function normalizeOrderStatus(status) {
  const key = String(status || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
  if (key === 'cancelled' || key === 'canceled') return 'cancel'
  return key
}

function formatDetailMoney(amount, currency = 'EUR') {
  if (amount == null || amount === '') return '—'
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  } catch {
    return `€${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
}

function mapAdminOrderProduct(product, currency) {
  const quantity = product.quantity
  const unitLabel = product.unit

  return {
    id: product.id,
    product: product.title,
    category: product.category,
    material: product.material,
    weightSize: product.weightSize,
    qty:
      quantity != null && unitLabel
        ? `${quantity} ${unitLabel}`
        : quantity ?? '—',
    unit: formatDetailMoney(product.unitPrice, currency),
    warehouse: product.warehouseLocation,
    total: formatDetailMoney(product.total, currency),
  }
}

function mapAdminOrderTotals(totals) {
  if (!totals) return {}

  return {
    subtotal: totals.subTotal,
    discount: totals.discountAmount ?? 0,
    shipping: totals.shippingFee,
    grandTotal: totals.grandTotal,
    total: totals.grandTotal,
    commission: totals.commission,
    vatAmount: totals.vatAmount,
  }
}

function mapShipmentToTransporter(shipment) {
  if (!shipment) return null

  const name =
    shipment.transporterName ||
    shipment.name ||
    shipment.driverName ||
    null

  if (!name) return null

  return {
    name,
    email: shipment.email || '',
    phone: shipment.phone || shipment.driverPhone || '',
    vehicle: shipment.vehicle || shipment.vehicleLabel || '',
    initials: shipment.initials,
  }
}

function mapFactoryDetailStatus(status) {
  if (status === 'assigned') return 'assigned'
  if (status === 'produced') return 'produced'
  if (status === 'ready') return 'ready'
  if (status === 'in_production') return 'produced'
  return 'produced'
}

function mapFactoryPayment(apiOrder, currency) {
  const totals = apiOrder.totals || {}

  return {
    totalPrice: formatDetailMoney(totals.grandTotal, currency),
    paidAmount: formatDetailMoney(apiOrder.paidAmount ?? 0, currency),
    remainingBalance: formatDetailMoney(
      apiOrder.remainingBalance ?? totals.grandTotal,
      currency,
    ),
    paidNote: apiOrder.paidNote,
    duration: apiOrder.installmentDuration,
  }
}

/** Map backend order row → admin orders table shape */
export function mapAdminOrder(order) {
  return {
    id: order.id,
    orderId: order.orderId,
    customerName: order.customerName,
    customerType: String(order.customerType || '')
      .trim()
      .toLowerCase(),
    items: order.items,
    total: order.total,
    commission: order.commission,
    status: normalizeOrderStatus(order.status),
    date: order.date,
  }
}

/** Map backend order detail → admin detail views */
export function mapAdminOrderDetail(apiOrder) {
  if (!apiOrder) return null

  const currency = apiOrder.currency || 'EUR'
  const status = normalizeOrderStatus(apiOrder.status)
  const customerType = String(apiOrder.customerType || '')
    .trim()
    .toLowerCase()
  const isCompany = customerType === 'company'
  const tab = apiOrder.tab || 'supplier'
  const customer = apiOrder.customer || {}
  const seller = apiOrder.seller || {}

  const logistics = {
    deliveryLocation: apiOrder.shippingAddress,
    pickupLocation: apiOrder.billingAddress,
    unloadingType: apiOrder.unloadingType,
    accessCondition: apiOrder.accessCondition,
  }

  const base = {
    id: apiOrder.id,
    orderId: apiOrder.orderId,
    orderDate: apiOrder.date,
    status,
    statusCode: apiOrder.statusCode,
    tab,
    hasInstallment:
      tab === 'factory' ||
      Boolean(apiOrder.hasInstallment) ||
      Boolean(apiOrder.installments?.length),
    recipientType: isCompany ? 'company' : 'customer',
    customer: isCompany ? null : customer,
    company: isCompany ? { ...customer, project: apiOrder.project } : null,
    supplier: {
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
    },
    seller,
    logistics,
    transporter: mapShipmentToTransporter(apiOrder.shipment),
    products: (apiOrder.products || []).map((product) =>
      mapAdminOrderProduct(product, currency),
    ),
    totals: mapAdminOrderTotals(apiOrder.totals),
    cancelReason: apiOrder.cancellationReason,
    cancelledByAdmin: apiOrder.cancelledByAdmin,
    statusHistory: apiOrder.statusHistory || [],
    invoices: apiOrder.invoices || [],
    currency,
  }

  if (tab === 'factory') {
    const factorySeller =
      String(seller.role || '').toUpperCase() === 'FACTORY' ? seller : null

    return {
      ...base,
      supplier: apiOrder.company || customer,
      factory: apiOrder.factory || factorySeller || seller,
      factoryDetailStatus: mapFactoryDetailStatus(status),
      payment: mapFactoryPayment(apiOrder, currency),
      installmentBreakdown: (apiOrder.installmentBreakdown || []).map(
        (row, index) => ({
          id: row.id || `installment-${index}`,
          product: row.product || row.title,
          category: row.category,
          material: row.material,
          weightSize: row.weightSize,
          qty: row.qty || row.quantity,
          warehouse: row.warehouse || row.warehouseLocation,
          installmentNumber: row.installmentNumber,
          amount: formatDetailMoney(row.amount ?? row.total, currency),
        }),
      ),
      installments: apiOrder.installments || [],
    }
  }

  return base
}
