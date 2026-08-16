import {
  DEMO_ORDER_ASSIGNED,
  DEMO_ORDER_CANCEL,
  DEMO_ORDER_INSTALLMENTS,
  DEMO_ORDER_NEW,
  DEMO_ORDER_PENDING,
} from '@/data/demoData'

const ADMIN_INSTALLMENT_PRODUCTS = [
  {
    id: 'aip1',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '180 bags',
    unit: '€50.75',
    warehouse: '3464 Royal Ln. Mesa, New Jersey 45463',
    total: '€9,113.00',
  },
]

const ADMIN_INSTALLMENT_BREAKDOWN = [
  {
    id: 'aib1',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    installmentNumber: '1st Installment',
    amount: '€9,113.00',
  },
  {
    id: 'aib2',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    installmentNumber: '2nd Installment',
    amount: '€9,113.00',
  },
  {
    id: 'aib3',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    installmentNumber: '3rd Installment',
    amount: '€9,113.00',
  },
  {
    id: 'aib4',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    installmentNumber: '4th Installment',
    amount: '€9,113.00',
  },
  {
    id: 'aib5',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    installmentNumber: '5th Installment',
    amount: '€9,113.00',
  },
  {
    id: 'aib6',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    installmentNumber: '6th Installment',
    amount: '€9,113.00',
  },
]

const ADMIN_INSTALLMENT_PAYMENT = {
  totalPrice: '€125,500',
  paidAmount: '€25,100',
  remainingBalance: '€100,400',
  paidNote: 'Pay €10,040/month for 10 months',
  duration: '10 months',
}

const ADMIN_INSTALLMENT_LOGISTICS = {
  deliveryLocation: '123 Main St, Downtown',
  pickupLocation: 'Downtown Office Complex',
  unloadingType: 'Tipper truck',
  accessCondition: 'Manual Unloading',
}

const ADMIN_INSTALLMENT_COMPANY = {
  name: 'ABC CORP',
  email: 'abccorp@gmail.com',
  phone: '+123 765 3490',
  project: 'Downtown Office Complex',
}

const ADMIN_FACTORY_PARTNER = {
  name: 'Insustries Group',
  email: 'zaraislam@gmail.com',
  phone: '+123 765 3490',
}

const ADMIN_FACTORY_TRANSPORTER = {
  name: 'John Smith',
  email: '',
  phone: '+1 23 456 7890',
  vehicle: 'Truck #TR-4523',
  initials: 'JS',
}

function buildFactoryInstallments() {
  return DEMO_ORDER_INSTALLMENTS.map((item) => ({
    ...item,
    quantity: '30 bags',
  }))
}

export const ADMIN_ORDER_TABS = [
  { id: 'supplier', labelKey: 'adminOrders.tabs.supplier' },
  { id: 'factory', labelKey: 'adminOrders.tabs.factory' },
]

export const ADMIN_ORDERS = [
  {
    id: 'ord-1001',
    orderId: 'ORD-1001',
    customerName: 'John Doe',
    customerType: 'company',
    items: 3,
    total: 450,
    commission: 90,
    status: 'new',
    date: '2026-05-01',
    orderKind: 'supplier',
  },
  {
    id: 'ord-1002',
    orderId: 'ORD-1002',
    customerName: 'Jenny Wilson',
    customerType: 'customer',
    items: 1,
    total: 285,
    commission: 42,
    status: 'pending',
    date: '2026-05-03',
    orderKind: 'supplier',
  },
  {
    id: 'ord-1003',
    orderId: 'ORD-1003',
    customerName: 'Marvin McKinney',
    customerType: 'company',
    items: 5,
    total: 1200,
    commission: 240,
    status: 'processing',
    date: '2026-05-05',
    orderKind: 'supplier',
  },
  {
    id: 'ord-1004',
    orderId: 'ORD-1004',
    customerName: 'Cameron Williamson',
    customerType: 'customer',
    items: 2,
    total: 680,
    commission: 102,
    status: 'assigned',
    date: '2026-05-08',
    orderKind: 'supplier',
  },
  {
    id: 'ord-1005',
    orderId: 'ORD-1005',
    customerName: 'Eleanor Pena',
    customerType: 'company',
    items: 4,
    total: 920,
    commission: 184,
    status: 'cancel',
    date: '2026-05-10',
    orderKind: 'supplier',
  },
  {
    id: 'ord-1006',
    orderId: 'ORD-1006',
    customerName: 'Brooklyn Simmons',
    customerType: 'customer',
    items: 6,
    total: 1540,
    commission: 231,
    status: 'completed',
    date: '2026-05-12',
    orderKind: 'supplier',
  },
  {
    id: 'ord-1007',
    orderId: 'ORD-1007',
    customerName: 'Jacob Jones',
    customerType: 'company',
    items: 2,
    total: 510,
    commission: 102,
    status: 'new',
    date: '2026-05-14',
    orderKind: 'supplier',
  },
  {
    id: 'ord-2001',
    orderId: 'ORD-2001',
    customerName: 'BuildCo Ltd',
    customerType: 'company',
    items: 8,
    total: 3200,
    commission: 480,
    status: 'pending',
    date: '2026-05-02',
    orderKind: 'factory',
  },
  {
    id: 'ord-2002',
    orderId: 'ORD-2002',
    customerName: 'Priya Nair',
    customerType: 'customer',
    items: 2,
    total: 890,
    commission: 133,
    status: 'processing',
    date: '2026-05-06',
    orderKind: 'factory',
  },
  {
    id: 'ord-2003',
    orderId: 'ORD-2003',
    customerName: 'Porto Mix Plant',
    customerType: 'company',
    items: 12,
    total: 5400,
    commission: 810,
    status: 'completed',
    date: '2026-05-11',
    orderKind: 'factory',
  },
]

export function formatOrderMoney(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return `€${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function filterOrdersByTab(rows, tab) {
  if (!tab) return rows
  return rows.filter((row) => row.orderKind === tab)
}

export function filterOrdersByCustomerType(rows, customerType) {
  if (!customerType || customerType === 'all') return rows
  return rows.filter(
    (row) =>
      String(row.customerType).toLowerCase() ===
      String(customerType).toLowerCase(),
  )
}

export function filterOrdersByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

export function filterOrdersBySearch(rows, query) {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => {
    const haystack = [
      row.orderId,
      row.customerName,
      row.customerType,
      row.status,
      row.date,
      row.items,
      row.total,
      row.commission,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function getAdminOrderRow(id) {
  return ADMIN_ORDERS.find((row) => row.id === id) ?? null
}

const DETAIL_CUSTOMER = {
  email: 'zaraislam@gmail.com',
  phone: '+123 765 3490',
  region: 'America',
  city: 'America',
  zipCode: '095764',
  address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
}

const DETAIL_SUPPLIER = {
  name: 'Zarah Islam',
  email: 'zaraislam@gmail.com',
  phone: '+123 765 3490',
}

export function getAdminOrderDetail(id) {
  const row = getAdminOrderRow(id)
  if (!row) return null

  if (row.orderKind === 'factory') {
    const status = String(row.status).toLowerCase()
    const factoryDetailStatus =
      status === 'processing' ? 'assigned' : 'produced'

    return {
      id: row.id,
      orderId: row.orderId,
      orderDate: row.date,
      status: status === 'pending' ? 'new' : 'assigned',
      hasInstallment: true,
      factoryDetailStatus,
      supplier: ADMIN_INSTALLMENT_COMPANY,
      factory: ADMIN_FACTORY_PARTNER,
      logistics: ADMIN_INSTALLMENT_LOGISTICS,
      payment: {
        ...ADMIN_INSTALLMENT_PAYMENT,
        payNowLabel: 'Pay Now (Down Payment)',
      },
      products: ADMIN_INSTALLMENT_PRODUCTS,
      installmentBreakdown: ADMIN_INSTALLMENT_BREAKDOWN,
      installments: buildFactoryInstallments(),
      transporter:
        factoryDetailStatus === 'assigned' ? ADMIN_FACTORY_TRANSPORTER : null,
    }
  }

  const customer = {
    ...DETAIL_CUSTOMER,
    name: row.customerName,
  }

  const base = {
    id: row.id,
    orderId: row.orderId,
    orderDate: row.date,
    customer,
    recipientType: 'customer',
    supplier: DETAIL_SUPPLIER,
    hasInstallment: false,
  }

  const status = String(row.status).toLowerCase()

  if (status === 'new') {
    return { ...DEMO_ORDER_NEW, ...base, status: 'new' }
  }
  if (status === 'pending' || status === 'processing') {
    return {
      ...DEMO_ORDER_PENDING,
      ...base,
      status: status === 'processing' ? 'processing' : 'pending',
    }
  }
  if (status === 'assigned' || status === 'completed') {
    return {
      ...DEMO_ORDER_ASSIGNED,
      ...base,
      status: status === 'completed' ? 'completed' : 'assigned',
    }
  }
  if (status === 'cancel') {
    return { ...DEMO_ORDER_CANCEL, ...base, status: 'cancel' }
  }

  return { ...DEMO_ORDER_PENDING, ...base, status: row.status }
}
