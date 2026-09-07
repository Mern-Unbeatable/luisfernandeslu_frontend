function formatOrderPrice(price) {
  if (price == null || price === '') return '—'
  const num = Number(price)
  if (Number.isNaN(num)) return String(price)

  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function formatDisplayDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function mapProjectMaterialRow(item) {
  const duePayment =
    item.duePaymentLabel
    ?? (item.duePayment ? formatOrderPrice(item.duePayment) : '—')

  return {
    id: item.id ?? item.orderId,
    orderId: item.orderId ?? item.id,
    orderNumber: item.orderNumber,
    materialName: item.materialName,
    orderedQuantity: item.orderedQuantity,
    deliveredValue: formatOrderPrice(item.deliveredValue),
    duePayment,
    status: String(item.status || '').trim().toLowerCase(),
    orderStatus: item.orderStatus,
    createdAt: item.createdAt,
  }
}

function mapInstallment(item, index) {
  const rawDueDate = item.dueDate ?? item.dueAt

  return {
    id: item.id ?? String(index + 1),
    title: item.title ?? `${index + 1}${getOrdinalSuffix(index + 1)} Installment`,
    installmentNumber: item.installmentNumber ?? index + 1,
    status: String(item.status || 'pending').trim().toLowerCase(),
    dueDate: rawDueDate ? formatDisplayDate(rawDueDate) : '—',
    amount: formatOrderPrice(item.amount),
    quantity: item.quantity ?? item.quantityLabel,
    canPayNow: Boolean(item.canPayNow),
    isPaid: Boolean(item.isPaid),
  }
}

function mapDriver(driver) {
  if (!driver) return null

  return {
    id: driver.id,
    name: driver.name,
    phone: driver.phone,
    vehicle: driver.vehicle,
  }
}

function mapProgressSteps(steps = []) {
  return steps.map((step) => ({
    id: step.id,
    label: step.label,
    date: step.at ? formatDisplayDate(step.at) : undefined,
    completed: Boolean(step.completed),
  }))
}

function getOrdinalSuffix(value) {
  const remainder = value % 10
  const remainder100 = value % 100
  if (remainder100 >= 11 && remainder100 <= 13) return 'th'
  if (remainder === 1) return 'st'
  if (remainder === 2) return 'nd'
  if (remainder === 3) return 'rd'
  return 'th'
}

/** Map backend company project list row */
export function mapCompanyProject(project) {
  return {
    id: project.id,
    name: project.name ?? project.projectName,
    address: project.address ?? project.location,
    categoryLabel: project.categoryLabel,
    orderCount: project.orderCount ?? 0,
    materialTypes: project.materialTypes ?? 0,
    deliveredValue: project.deliveredValue,
    duePayment: project.duePayment,
    createdAt: project.createdAt,
  }
}

/** Map backend company project detail */
export function mapCompanyProjectDetail(data) {
  const project = data?.project ?? data
  if (!project) return null

  const materials = (project.materials ?? project.orders ?? []).map(
    mapProjectMaterialRow,
  )

  return {
    id: project.id,
    name: project.name ?? project.projectName,
    location: project.location ?? project.address,
    materialTypes: String(project.materialTypes ?? 0),
    deliveredValue: formatOrderPrice(project.deliveredValue),
    duePayment: formatOrderPrice(project.duePayment),
    orderCount: project.orderCount ?? 0,
    materials,
    createdAt: project.createdAt,
  }
}

/** Map backend company project order / material detail */
export function mapCompanyProjectOrderDetail(data) {
  const order = data?.order ?? data
  if (!order) return null

  const paymentSummary = order.paymentSummary ?? {}
  const progressPercent = paymentSummary.progressPercent ?? 0

  return {
    id: order.id,
    projectId: order.projectId,
    materialName: order.materialName ?? order.productName,
    orderId: order.orderNumber ? `#${order.orderNumber}` : order.id,
    orderNumber: order.orderNumber,
    planLabel: order.planLabel ?? null,
    planRange: order.planRange ?? null,
    installmentMonths: order.installmentMonths ?? null,
    supplierName: order.supplierName ?? '—',
    projectName: order.projectName ?? '—',
    totalOrderValue: formatOrderPrice(order.total),
    reminder: order.reminder ?? null,
    paymentSummary: {
      totalAmount: formatOrderPrice(paymentSummary.totalAmount ?? order.total),
      paidAmount: formatOrderPrice(paymentSummary.paidAmount),
      remainingBalance: formatOrderPrice(paymentSummary.remainingBalance),
      progressPercent,
      progressLabel: `${progressPercent}% Completed`,
      nextInstallmentDate: formatDisplayDate(
        paymentSummary.nextInstallmentDate,
      ),
      monthlyPayment: formatOrderPrice(paymentSummary.monthlyPayment),
      note: paymentSummary.note ?? order.payment?.note ?? null,
    },
    payment: order.payment
      ? {
          payNow: formatOrderPrice(order.payment.payNow),
          remaining: formatOrderPrice(order.payment.remaining),
          monthly: formatOrderPrice(order.payment.monthly),
          months: order.payment.months ?? null,
          note: order.payment.note ?? null,
        }
      : null,
    installments: (order.installments ?? []).map(mapInstallment),
    status: String(order.status || '').trim().toLowerCase(),
    orderStatus: order.orderStatus,
    quantityLabel: order.quantityLabel,
    deliveryLocation: order.deliveryLocation,
    unloadingType: order.unloadingType,
    accessConditions: order.accessConditions,
    driver: mapDriver(order.driver),
    progressSteps: mapProgressSteps(order.progressSteps),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
}
