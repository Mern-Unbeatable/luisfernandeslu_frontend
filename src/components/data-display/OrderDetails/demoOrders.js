/** Shared demo products for order details */
export const DEMO_ORDER_PRODUCTS = [
  {
    id: 'p1',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '180 bags',
    unit: '$8.75',
    warehouse: '3464 Royal Ln. Mesa, New Jersey 45463',
    total: '$1,575.00',
  },
  {
    id: 'p2',
    product: 'TMT Rebar Steel Rods',
    category: 'Structural Steel',
    material: 'Steel',
    weightSize: '12 mm dia, 40 ft length',
    qty: '2.8 tons',
    unit: '$785.00',
    warehouse: '3464 Royal Ln. Mesa, New Jersey 45463',
    total: '$2,198.00',
  },
  {
    id: 'p3',
    product: 'Red Clay Modular Bricks',
    category: 'Masonry',
    material: 'Bricks',
    weightSize: '190 × 90 × 90 mm, M150',
    qty: '5,000 pcs',
    unit: '$0.42',
    warehouse: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    total: '$2,100.00',
  },
]

export const DEMO_INSTALLMENT_BREAKDOWN = [
  {
    id: 'ib1',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '50 bags',
    warehouse: '3464 Royal Ln. Mesa, New Jersey 45463',
    installmentNumber: '1st Installment',
    amount: '$5,333.33',
  },
  {
    id: 'ib2',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '50 bags',
    warehouse: '3464 Royal Ln. Mesa, New Jersey 45463',
    installmentNumber: '2nd Installment',
    amount: '$5,333.33',
  },
  {
    id: 'ib3',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '50 bags',
    warehouse: '3464 Royal Ln. Mesa, New Jersey 45463',
    installmentNumber: '3rd Installment',
    amount: '$5,333.34',
  },
]

export const DEMO_ORDER_INSTALLMENTS = [
  {
    id: '1',
    title: '1st Installment',
    status: 'completed',
    dueDate: 'Mar 15, 2026',
    amount: '$8,333',
  },
  {
    id: '2',
    title: '2nd Installment',
    status: 'pending',
    dueDate: 'Apr 15, 2026',
    amount: '$8,333',
  },
  {
    id: '3',
    title: '3rd Installment',
    status: 'pending',
    dueDate: 'May 15, 2026',
    amount: '$8,333',
  },
  {
    id: '4',
    title: '4th Installment',
    status: 'pending',
    dueDate: 'Jun 15, 2026',
    amount: '$8,333',
  },
  {
    id: '5',
    title: '5th Installment',
    status: 'pending',
    dueDate: 'Jul 15, 2026',
    amount: '$8,333',
  },
  {
    id: '6',
    title: '6th Installment',
    status: 'pending',
    dueDate: 'Aug 15, 2026',
    amount: '$8,335',
  },
]

const baseCompany = {
  name: 'ABC CORP',
  email: 'abccorp@gmail.com',
  phone: '+123 765 3490',
  project: 'Downtown Office Complex',
  taxId: 'TX-998877',
}

const baseTransporter = {
  name: 'Esther Howard',
  email: 'bill.sanders@example.com',
  phone: '(385) 555-0121',
  vehicle: 'Truck #TR-2034',
  initials: 'EH',
}

const baseLogistics = {
  deliveryLocation: '123 Main St, Downtown',
  pickupLocation: 'Downtown Office Complex',
  unloadingType: 'Tipper truck',
  accessCondition: 'Manual Unloading',
}

const baseTotals = {
  grandTotal: '$5,873.00',
  shipping: '$1,200.00',
  total: '$7,073.00',
}

/** hasInstallment=false · Pending */
export const DEMO_ORDER_PENDING = {
  id: 'COM-1001',
  orderId: 'COM-1001',
  orderDate: '2026-05-01',
  status: 'pending',
  hasInstallment: false,
  company: baseCompany,
  logistics: baseLogistics,
  products: DEMO_ORDER_PRODUCTS,
  totals: baseTotals,
  transporter: null,
  cancelReason: null,
}

/** hasInstallment=false · New (Accept button) */
export const DEMO_ORDER_NEW = {
  ...DEMO_ORDER_PENDING,
  id: 'ORD-1001',
  orderId: 'ORD-1001',
  status: 'new',
  company: {
    name: 'Zarah Islam',
    email: 'zaraislam@gmail.com',
    phone: '+123 765 3400',
    project: 'America',
    region: 'America',
    city: 'America',
    zipCode: '095764',
    address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
  },
}

/** hasInstallment=false · Assigned */
export const DEMO_ORDER_ASSIGNED = {
  ...DEMO_ORDER_PENDING,
  status: 'assigned',
  transporter: baseTransporter,
}

/** hasInstallment=false · Cancel */
export const DEMO_ORDER_CANCEL = {
  ...DEMO_ORDER_ASSIGNED,
  status: 'cancel',
  cancelReason:
    'Order has been cancelled by the customer as the requirement has been updated and the purchase is no longer needed.',
}

/** hasInstallment=true · New (no transporter card) */
export const DEMO_ORDER_INSTALLMENT_NEW = {
  id: 'ORD-007',
  orderId: 'ORD-007',
  orderDate: '2026-03-01',
  status: 'new',
  hasInstallment: true,
  role: 'company',
  canPayInstallments: true,
  company: {
    ...baseCompany,
    phone: '+1 23 789 2456',
    email: 'abc-corp@gmail.com',
  },
  logistics: {
    ...baseLogistics,
    pickupLocation: 'Downtown Office Building',
    materials: 'Bituminous',
  },
  payment: {
    totalPrice: '$120,500',
    paidAmount: '$20,000',
    remainingBalance: '$100,500',
    paidNote: 'Paid 2/12 installment For 10 month',
    nextDueLabel: null,
    duration: '10 Months',
  },
  products: [
    {
      id: 'ip1',
      product: 'UltraTech Portland Cement',
      category: 'Building Materials',
      material: 'Cement',
      weightSize: '50 kg bag, OPC 53 grade',
      qty: '150 bags',
      unit: '$60.70',
      warehouse: '3464 Royal Ln. Mesa, New Jersey 45463',
      total: '$9,112.50',
    },
  ],
  installmentBreakdown: DEMO_INSTALLMENT_BREAKDOWN,
  installments: DEMO_ORDER_INSTALLMENTS,
  transporter: null,
  totals: null,
}

/** hasInstallment=true · Assigned / with transporter */
export const DEMO_ORDER_INSTALLMENT_ASSIGNED = {
  ...DEMO_ORDER_INSTALLMENT_NEW,
  id: 'ORD-001',
  orderId: 'ORD-001',
  status: 'assigned',
  role: 'company',
  canPayInstallments: true,
  payment: {
    totalPrice: '$126,000',
    paidAmount: '$25,100',
    remainingBalance: '$100,400',
    paidNote: 'Last installment paid on 12-05-24',
    nextDueLabel: 'Next installment due on May 15, 2024',
    duration: '12 Months',
  },
  transporter: {
    name: 'John Smith',
    email: '',
    phone: '+1 23 456 7890',
    vehicle: 'Truck #TR-2034',
    initials: 'JS',
  },
  products: [
    {
      id: 'ip2',
      product: 'UltraSet Portland Cement',
      category: 'Binding Materials',
      material: 'Cement',
      weightSize: '50 kg bag, OPC 53 grade',
      qty: '120 bags',
      unit: '$50.75',
      warehouse: '',
      total: '$6,110.00',
    },
  ],
}
