const SHARED_PROJECT = {
  projectName: 'Downtown Office Complex',
  projectAddress: '123 Main St, Downtown',
}

const PROGRESS_STEPS = [
  {
    id: 'confirmed',
    label: 'Order Confirmed',
    date: 'Apr 15, 10:00 AM',
    completed: true,
  },
  {
    id: 'dispatch',
    label: 'Ready for Dispatch',
    date: 'Apr 15, 2:00 PM',
    completed: true,
  },
  {
    id: 'picked',
    label: 'Picked Up',
    date: 'Apr 16, 8:00 AM',
    completed: true,
  },
  { id: 'transit', label: 'In Transit', completed: false },
  { id: 'delivered', label: 'Delivered', completed: false },
]

const DRIVER = {
  name: 'John Smith',
  vehicle: 'Truck #TR-4523',
  phone: '+1 (555) 123-4567',
}

export const COMPANY_ORDERS_LIST = [
  {
    id: 'ORD-004',
    productName: 'Portland Cement',
    quantityLabel: '200 tons',
    status: 'progress',
    ...SHARED_PROJECT,
  },
  {
    id: 'ORD-003',
    productName: 'Steel Rebar',
    quantityLabel: '300 tons',
    status: 'pending',
    ...SHARED_PROJECT,
  },
  {
    id: 'ORD-002',
    productName: 'Fine Sand',
    quantityLabel: '150 tons',
    status: 'assign',
    ...SHARED_PROJECT,
  },
  {
    id: 'ORD-001',
    productName: 'Portland Cement',
    quantityLabel: '200 tons',
    status: 'completed',
    ...SHARED_PROJECT,
  },
  {
    id: 'ORD-005',
    productName: 'Concrete Blocks',
    quantityLabel: '5000 pcs',
    status: 'progress',
    projectName: 'Harbor Warehouse',
    projectAddress: '45 Dock Rd, Riverside',
  },
  {
    id: 'ORD-006',
    productName: 'Gypsum Board',
    quantityLabel: '800 sheets',
    status: 'pending',
    projectName: 'Metro Retail Fit-out',
    projectAddress: '88 Central Ave',
  },
  {
    id: 'ORD-007',
    productName: 'Roofing Sheets',
    quantityLabel: '1200 sheets',
    status: 'completed',
    projectName: 'Greenfield Plant',
    projectAddress: 'Plot 12, Industrial Zone',
  },
]

export const COMPANY_ORDER_DETAIL_ORD001 = {
  id: 'ORD-001',
  productName: 'Portland Cement',
  quantityLabel: '200 tons',
  status: 'delivered',
  projectName: SHARED_PROJECT.projectName,
  deliveryLocation: SHARED_PROJECT.projectAddress,
  totalPrice: '€125,500',
  installmentLabel: '10 months',
  payment: {
    payNow: '€25,100',
    remaining: '€100,400',
    note: 'Pay €10,040/month for 10 months',
  },
  unloadingType: 'Tipper truck',
  accessConditions: 'Manual Unloading',
  driver: DRIVER,
  progressSteps: PROGRESS_STEPS,
}

export function getCompanyOrderDetail(orderId) {
  if (orderId === 'ORD-001') return COMPANY_ORDER_DETAIL_ORD001
  const row = COMPANY_ORDERS_LIST.find((item) => item.id === orderId)
  if (!row) return null
  return {
    ...COMPANY_ORDER_DETAIL_ORD001,
    id: row.id,
    productName: row.productName,
    quantityLabel: row.quantityLabel,
    status: row.status,
    projectName: row.projectName,
    deliveryLocation: row.projectAddress,
  }
}
