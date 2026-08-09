/**
 * Central demo / mock data for UI development (no backend yet).
 *
 * Import: import { DEMO_PRODUCT, DEMO_USERS } from '@/data/demoData'
 *
 * When the backend is ready, replace these usages feature-by-feature with
 * RTK Query hooks from features/<module>/*Api.js. Do not grow this file
 * for production — delete or shrink sections as each API lands.
 *
 * Related static catalog (mega menu): src/data/productCategories.js
 */

import {
  FiAlertCircle,
  FiBriefcase,
  FiDollarSign,
  FiHome,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi'

// ── Auth ──────────────────────────────────────────────────────────
export const DEMO_PASSWORD = 'demo123'

export const DEMO_USERS = [
  {
    role: 'customer',
    email: 'customer@demo.com',
    password: DEMO_PASSWORD,
    name: 'Customer Demo',
    labelKey: 'auth.demo.customer',
  },
  {
    role: 'company',
    email: 'company@demo.com',
    password: DEMO_PASSWORD,
    name: 'Company Demo',
    labelKey: 'auth.demo.company',
  },
  {
    role: 'supplier',
    email: 'supplier@demo.com',
    password: DEMO_PASSWORD,
    name: 'Supplier Demo',
    labelKey: 'auth.demo.supplier',
  },
  {
    role: 'factory',
    email: 'factory@demo.com',
    password: DEMO_PASSWORD,
    name: 'Factory Demo',
    labelKey: 'auth.demo.factory',
  },
  {
    role: 'transporter',
    email: 'transporter@demo.com',
    password: DEMO_PASSWORD,
    name: 'Transporter Demo',
    labelKey: 'auth.demo.transporter',
  },
  {
    role: 'affiliate',
    email: 'affiliate@demo.com',
    password: DEMO_PASSWORD,
    name: 'Affiliate Demo',
    labelKey: 'auth.demo.affiliate',
  },
  {
    role: 'admin',
    email: 'admin@demo.com',
    password: DEMO_PASSWORD,
    name: 'Admin Demo',
    labelKey: 'auth.demo.admin',
  },
]

const BUYER_ROLES = new Set(['customer', 'company'])

// ── Product details ───────────────────────────────────────────────
const IMG_MAIN =
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80'
const IMG_2 =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
const IMG_3 =
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80'
const IMG_4 =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
const AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'

export const DEMO_PRODUCT = {
  title: 'Portland Cement',
  sku: 'A264671',
  category: 'Building Materials',
  availability: 'In Stock',
  warehouse: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
  rating: 4.7,
  feedbackCount: 21671,
  price: '$130.00',
  priceText: '$130.00 Per Bag ( 50kg )',
  unit: 'Bag ( 50kg )',
  minOrder: '10 PCS',
  images: [IMG_MAIN, IMG_2, IMG_3, IMG_4],
  bulkPricing: [
    { range: '1 - 2', price: '$24.00 each' },
    { range: '3 - 5', price: '$21.60 each' },
    { range: '6 - 11', price: '$20.40 each' },
    { range: '12 - 27', price: '$19.20 each' },
    { range: '28 - 49', price: '$18.00 each' },
    { range: '50 - 79', price: '$17.40 each' },
    { range: '80 - 120', price: '$16.80 each' },
  ],
  seller: {
    name: 'RQA Store',
    avatar: AVATAR,
    rating: 4.5,
    reviewCount: 66,
    email: 'contact@a2a-supplies.com',
    phone: '+1 (555) 012-3456',
  },
  descriptionParagraphs: [
    'Portland Cement is a high-quality binding material designed for durable concrete and masonry work across residential, commercial, and industrial projects.',
    'It delivers consistent strength, smooth workability, and reliable setting performance — ideal for foundations, slabs, columns, plastering, and finishing.',
    'Engineered for everyday construction demands, this cement helps reduce cracking risk and supports long-lasting structural results when mixed and cured properly.',
  ],
  features: [
    'High Strength & Durability',
    'Smooth Workability',
    'Crack Resistance Performance',
    'Suitable for All Construction Types',
    'Consistent Quality & Reliable Results',
    'Easy Mixing & Application',
  ],
  additionalParagraphs: [
    'This Portland Cement is suitable for general construction including concrete work, flooring, masonry, plastering, and structural applications.',
    'Brand: Superstrong. Type: OPC / PCC. Grade: 42.5. Form: Powder. Color: Grey. Packaging Size: 50 KG Bag.',
    'It offers reliable compressive strength, controlled setting time, and good compatibility with standard aggregates and common admixtures. Quality is assured per manufacturer guidelines.',
  ],
  specificationParagraphs: [
    'Net Weight: 50 kg. Cement Type: Portland. Fineness: Standard.',
    'Storage: Keep dry and sealed. Shelf Life: 3 months from manufacture. Origin: Local / Imported mix.',
    'Use clean water and proper mix ratios for best results. Follow site curing practices to achieve designed strength and durability.',
  ],
  reviews: [
    {
      id: 'r1',
      author: 'Carlos M.',
      rating: 5,
      text: 'Consistent quality and easy to work with on slab pours.',
    },
    {
      id: 'r2',
      author: 'Priya S.',
      rating: 4,
      text: 'Good strength development. Packaging arrived intact.',
    },
  ],
  supplierDetails: [
    { label: 'Company', value: 'A2A Construction Supplies' },
    { label: 'Contact Person', value: 'Atik Adnan' },
    { label: 'Email', value: 'contact@a2a-supplies.com' },
    { label: 'Phone', value: '+1 (555) 012-3456' },
  ],
  supplierBusiness: [
    { label: 'Business Type', value: 'Building Materials Supplier' },
    { label: 'Years Active', value: '8+' },
    { label: 'Service Area', value: 'Illinois & nearby states' },
    { label: 'Verification', value: 'Verified vendor' },
  ],
}

/** Admin-facing seller label override */
export const ADMIN_PRODUCT = {
  ...DEMO_PRODUCT,
  seller: {
    ...DEMO_PRODUCT.seller,
    name: 'A2A Construction Supplies',
  },
}

// ── Orders ────────────────────────────────────────────────────────
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

/**
 * Installment order demo used for “No Pay” preview (showPay omitted / false).
 */
export const DEMO_ORDER_INSTALLMENT_SUPPLIER = {
  ...DEMO_ORDER_INSTALLMENT_ASSIGNED,
  id: 'ORD-SUP-001',
  orderId: 'ORD-SUP-001',
}

// ── Installment timeline ──────────────────────────────────────────
export const DEMO_INSTALLMENTS = [
  {
    id: '1',
    title: '1st Installment',
    status: 'completed',
    dueDate: 'Mar 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
  },
  {
    id: '2',
    title: '2nd Installment',
    status: 'pending',
    dueDate: 'Apr 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
  },
  {
    id: '3',
    title: '3rd Installment',
    status: 'pending',
    dueDate: 'May 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
  },
  {
    id: '4',
    title: '4th Installment',
    status: 'pending',
    dueDate: 'Jun 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
  },
  {
    id: '5',
    title: '5th Installment',
    status: 'pending',
    dueDate: 'Jul 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
  },
  {
    id: '6',
    title: '6th Installment',
    status: 'pending',
    dueDate: 'Aug 15, 2026',
    amount: '$8,335',
    quantity: '30 bags',
  },
]

// ── Auction cards ─────────────────────────────────────────────────
export const DEMO_AUCTION_CREATED = {
  id: 'auc-ord-001',
  orderId: 'ORD-2026-001',
  pickupLocation: '1234 Main St, Los Angeles, CA',
  customerName: 'John Smith',
  deliveryLocation: '5678 Oak Ave, San Francisco, CA',
  productName: 'Construction Materials - Steel Beams',
  status: 'open',
}

export const DEMO_AUCTION_ASSIGNED = {
  id: 'auc-ord-002',
  orderId: 'ORD-2026-002',
  productName: 'Heavy Machinery - Excavator',
  pickupLocation: '890 Industrial Blvd, Houston, TX',
  deliveryLocation: '2345 Commerce St, Dallas, TX',
  assignedTransporter: 'Swift Transport Co.',
  bidPrice: 4500,
  status: 'assigned',
}

export const DEMO_AUCTION_LIVE = {
  id: 'auc-001',
  auctionId: 'AUC-001',
  title: 'Premium Portland Cement',
  quantity: '500 bags (50kg each)',
  pickupLocation: 'Ambuja Cement Factory, Kalyan',
  deliveryLocation: 'Metro Construction Site, Andheri West',
  distance: '32 km',
  endsAt: null,
  remainingLabel: '5m 11s',
  dateLabel: '6/21/2026',
  status: 'bidding',
  bids: [
    { id: 'b1', amount: 285, label: 'Just now', at: '5/20/2026, 4:16:01 PM', transporterName: 'FastShip Logistics' },
    { id: 'b2', amount: 290, label: '1 min ago', at: '5/20/2026, 4:15:01 PM', transporterName: 'Swift Transport Co.' },
    { id: 'b3', amount: 310, label: '3 min ago', at: '5/20/2026, 4:13:01 PM', transporterName: 'RoadRunner Freight' },
    { id: 'b4', amount: 320, label: '4 min ago', at: '5/20/2026, 4:12:01 PM', transporterName: 'HaulMaster Inc.' },
  ],
}

// ── Auction details ───────────────────────────────────────────────
export const DEMO_AUCTION_DETAILS_ACTIVE = {
  id: 'auc-det-001',
  orderId: 'ORD-2026-002',
  auctionId: 'ORD-: AUC-001',
  auctionDate: 'May 18, 2026',
  pickupLocation: '890 Industrial Blvd, Houston, TX',
  deliveryCharge: '$2000.00',
  currentStatus: 'in-transit',
  status: 'active',
  customer: {
    name: 'Sarah Johnson',
    phone: '+1 (555) 234-5678',
    email: 'sarah.johnson@email.com',
    deliveryAddress: '2345 Commerce St, Dallas, TX 75201',
  },
  product: {
    name: 'Heavy Machinery - Excavator',
    sku: 'EXC-HD-2024',
    quantity: '500 bags (50kg each)',
    weight: '25000 kg',
    price: '$85,000',
  },
  shipping: {
    pickupLocation: 'Ambuja Cement Factory, Kalyan',
    unloadingInstructions: 'Metro Construction Site, Andheri West',
    accessCondition: 'Loading dock with ramp',
    additionalNotes:
      'Delivery must be coordinated with site manager. Contact 24 hours before arrival.',
  },
  bids: [
    {
      id: 'b1',
      transporterName: 'FastShip Logistics',
      at: '5/20/2026, 4:16:01 PM',
    },
    {
      id: 'b2',
      transporterName: 'QuickDelivery Express',
      at: '5/20/2026, 3:45:01 PM',
    },
    {
      id: 'b3',
      transporterName: 'BulkFreight Co',
      at: '5/20/2026, 2:30:01 PM',
    },
  ],
  transporter: null,
}

export const DEMO_AUCTION_DETAILS_ASSIGNED = {
  ...DEMO_AUCTION_DETAILS_ACTIVE,
  id: 'auc-det-002',
  status: 'assigned',
  currentStatus: 'in-transit',
  bids: [],
  transporter: {
    name: 'Swift Transport Co.',
    phone: '+1 (555) 987-6543',
    vehicleType: 'Heavy-duty flatbed truck',
    bidAmount: '$4,500',
    assignedAt: 'May 18, 2026 2:30 PM',
  },
}

/** Transporter view — assigned job. */
export const DEMO_AUCTION_DETAILS_TRANSPORTER = {
  ...DEMO_AUCTION_DETAILS_ACTIVE,
  id: 'auc-det-003',
  status: 'assigned',
  auctionId: 'ORD-: AUC-001',
  orderId: 'ORD-2026-002',
  deliveryCharge: '$2000.00',
  bids: [],
  transporter: {
    name: 'Swift Transport Co.',
    phone: '+1 (555) 987-6543',
    vehicleType: 'Heavy-duty flatbed truck',
    bidAmount: '$2000.00',
    assignedAt: 'May 18, 2026 2:30 PM',
  },
}

export const DEMO_AUCTION_DETAILS_TRANSPORTER_COMPLETE = {
  ...DEMO_AUCTION_DETAILS_TRANSPORTER,
  id: 'auc-det-004',
  status: 'complete',
  currentStatus: 'complete',
}

// ── Status cards ──────────────────────────────────────────────────
export const DEMO_STATUS_CARDS = {
  activeSuppliers: {
    variant: 'default',
    label: 'Active Suppliers',
    value: '342',
    icon: FiBriefcase,
    iconTone: 'brand',
  },
  totalUsers: {
    variant: 'default',
    label: 'Total Users',
    value: '12,453',
  },
  referredClients: {
    variant: 'default',
    label: 'Referred Clients',
    value: '18',
    description: 'Active paying subscriptions',
    icon: FiShoppingBag,
    iconTone: 'brand',
  },
  totalReferredInline: {
    variant: 'inline',
    label: 'Total Referred Client',
    value: '13',
    icon: FiUser,
    iconTone: 'purple',
  },
  availableBalance: {
    variant: 'action',
    label: 'Available Balance',
    value: '$67,400.00',
    icon: FiDollarSign,
    iconTone: 'brand',
    actionLabel: 'Withdraw Funds',
  },
  totalEarnings: {
    variant: 'filled',
    label: 'Total Earnings',
    value: '$580K',
    description: 'All time',
    icon: FiDollarSign,
    tone: 'brand',
  },
  adminCommission: {
    variant: 'default',
    label: 'Admin Comission',
    value: '20%',
    description: '20% per order',
  },
  paymentOverdue: {
    variant: 'status',
    label: 'Payment Overdue',
    value: '$12,400',
    description: '3 orders',
    tone: 'danger',
    icon: FiAlertCircle,
  },
  pendingBadge: {
    variant: 'badge',
    label: 'Pending',
    value: '18',
    badge: 18,
    tone: 'brand',
  },
  totalDocuments: {
    variant: 'filled',
    label: 'Total Documents',
    value: '4',
    tone: 'brand',
  },
  totalProducts: {
    variant: 'summary',
    label: 'Total Products',
    value: '42',
    description: "Active SKU'S",
    icon: FiHome,
    iconTone: 'teal',
  },
  lowStock: {
    variant: 'status',
    label: 'Low Stock Items',
    value: '5',
    description: 'Need Reorder',
    tone: 'warning',
    icon: FiAlertCircle,
  },
  outOfStock: {
    variant: 'status',
    label: 'Out Of Stock',
    value: '2',
    description: 'Urgent action needed',
    tone: 'danger',
    icon: FiAlertCircle,
  },
}

export const DEMO_STATUS_CARD_LIST = Object.entries(DEMO_STATUS_CARDS).map(
  ([id, props]) => ({ id, ...props }),
)

// ── Add Product form demos ────────────────────────────────────────
const EMPTY_ADD_PRODUCT = {
  warehouseLocation: '',
  categoryId: '',
  subCategoryId: '',
  productTypeId: '',
  title: '',
  quantity: '',
  basePrice: '',
  b2bDiscount: '',
  minB2bQuantity: '',
  sku: '',
  weight: '',
  description: '',
  feature: '',
  additionalInformation: '',
  specifications: '',
  bulkEnabled: true,
  bulkTiers: [
    { id: 'tier-1', quantity: '', price: '' },
    { id: 'tier-2', quantity: '', price: '' },
  ],
  bannerImage: null,
  otherImages: [],
}

export const DEMO_ADD_PRODUCT = {
  ...EMPTY_ADD_PRODUCT,
}

export const DEMO_FACTORY_PRODUCT = {
  ...EMPTY_ADD_PRODUCT,
  bulkEnabled: false,
  bulkTiers: [],
}

// ── Create Auction placeholders ───────────────────────────────────
/** Demo copy used as field placeholders (not prefilled values) */
export const DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS = {
  orderId: 'ORD-2026-001',
  pickupLocation: '1234 Main St, Los Angeles, CA',
  customerName: 'John Smith',
  phone: '+1 555 0100',
  email: 'john@example.com',
  deliveryAddress: '5678 Oak Ave, San Francisco, CA',
  productName: 'Construction Materials - Steel Beams',
  weight: '500 kg',
  sku: 'STL-BEAM-01',
  price: '$4,500',
  unloadingNeeds: 'Crane (12m)',
  unloadingInstruction: 'Unload near gate B',
  accessCondition: 'Easy Access',
  additionalNotes: 'Any additional information',
}

export const DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS = {
  orderId: 'ORD-2026-010',
  pickupLocation: 'Ambuja Cement Factory, Kalyan',
  customerName: 'Metro Construction',
  phone: '+91 98765 43210',
  email: 'ops@metro.com',
  deliveryAddress: 'Metro Construction Site, Andheri West',
  productName: 'Premium Portland Cement',
  weight: '25000 kg',
  sku: 'CEM-PPC-50',
  price: '$285',
}

/** @deprecated use DEMO_CREATE_AUCTION_*_PLACEHOLDERS */
export const DEMO_CREATE_AUCTION_SUPPLIER =
  DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS
export const DEMO_CREATE_AUCTION_FACTORY =
  DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS

// ── Messenger ─────────────────────────────────────────────────────
export const DEMO_MESSENGER_CHATS = [
  {
    id: 'c1',
    name: 'TechPrint Hub',
    lastMessage: 'Last one from the batch, best deal ever.',
    time: '4:17pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p1', name: 'TechPrint Hub', avatar: null },
  },
  {
    id: 'c2',
    name: 'Ope',
    lastMessage: 'You dey hung dier you kai say house dey',
    time: '6:21pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p2', name: 'Ope', avatar: null },
  },
  {
    id: 'c3',
    name: '3D Maker Store',
    lastMessage: "Can't wait to see it",
    time: '12:33pm',
    unreadCount: 0,
    online: false,
    partner: { id: 'p3', name: '3D Maker Store', avatar: null },
  },
  {
    id: 'c4',
    name: 'Printify Zone',
    lastMessage: 'Thanks for the update',
    time: '9:07pm',
    unreadCount: 0,
    online: false,
    partner: { id: 'p4', name: 'Printify Zone', avatar: null },
  },
  {
    id: 'c5',
    name: "Maker's Market",
    lastMessage: 'Offer sent for PLA filament.',
    time: 'Yesterday',
    unreadCount: 1,
    online: false,
    partner: { id: 'p5', name: "Maker's Market", avatar: null },
  },
]

export const DEMO_MESSENGER_OFFER = {
  title: 'Offer Card',
  statusLabel: 'Pending Response',
  product: 'Cements',
  quantity: '180 Bags',
  projectName: 'Downtown Office Complex',
  address: '123 Main St, Downtown District',
  unloadingType: 'Tipper truck',
  accessConditions: 'Manual Unloading',
  pricing: [
    { label: 'Total Price', value: '$125,500' },
    { label: 'Installment', value: '10 months' },
    { label: '1st Installment', value: '$125,500' },
    { label: 'Quantity', value: '30 Bags' },
    { label: '2nd Installment', value: '$125,500' },
    { label: 'Quantity', value: '30 Bags' },
  ],
  summary: {
    firstInstallment: '$25,100',
    remainingBalance: '$100,400',
    note: 'Pay $10,040/month for 10 months',
  },
}

export const DEMO_MESSENGER_MESSAGES = {
  c1: [
    {
      id: 'm1',
      sender: 'them',
      text: 'Hi — we need cement for the riverside project.',
      time: '4:05 PM',
      partner: { id: 'p1', name: 'TechPrint Hub' },
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Sure. I can prepare an offer with installment options.',
      time: '4:12 PM',
      status: 'Read',
    },
  ],
  c2: [
    {
      id: 'm10',
      sender: 'them',
      text: 'Yo mandem',
      time: '6:18 PM',
      partner: { id: 'p2', name: 'Ope' },
    },
    {
      id: 'm10b',
      sender: 'them',
      text: 'Cho dey house?',
      time: '6:19 PM',
      partner: { id: 'p2', name: 'Ope' },
    },
    {
      id: 'm11',
      sender: 'me',
      text: 'Kwasia 😂😅',
      time: '6:20 PM',
      status: 'Read',
    },
    {
      id: 'm11b',
      sender: 'me',
      text: 'You dey hung dier you kai say house dey',
      time: '6:21 PM',
      status: 'Read',
    },
  ],
  /** Buyer view: partner sent the offer → Pay Now / Negotiate */
  c5: [
    {
      id: 'm20',
      sender: 'them',
      text: 'Here is our offer for PLA filament.',
      time: '5:10 PM',
      partner: { id: 'p5', name: "Maker's Market" },
    },
    {
      id: 'm21',
      sender: 'them',
      type: 'offer',
      time: '5:12 PM',
      partner: { id: 'p5', name: "Maker's Market" },
      offer: {
        ...DEMO_MESSENGER_OFFER,
        statusLabel: 'Pending Response',
        product: 'PLA filament',
      },
    },
  ],
  c4: [
    {
      id: 'm30',
      sender: 'them',
      text: 'Thanks for the update',
      time: '9:07 PM',
      partner: { id: 'p4', name: 'Printify Zone' },
    },
    {
      id: 'm31',
      sender: 'me',
      text: 'Anytime — let me know if you need anything else.',
      time: '9:10 PM',
      status: 'Read',
    },
  ],
}

// ── Dispute resolution ─────────────────────────────────────────────
const DISPUTE_IMG_MARBLE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=80'
const DISPUTE_IMG_GRANITE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'
const DISPUTE_EVIDENCE_1 =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80'
const DISPUTE_EVIDENCE_2 =
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80'

const DEMO_DISPUTE_MESSAGES = [
  {
    id: 'dm1',
    author: 'Alex Johnson',
    roleLabel: 'Buyer',
    role: 'buyer',
    align: 'right',
    at: '3/15/2024, 10:30 AM',
    text: 'The items arrived with loose packaging and visible cracks on the marble edges.',
  },
  {
    id: 'dm2',
    author: 'Tech Haven',
    roleLabel: 'Seller',
    role: 'seller',
    align: 'left',
    at: '3/15/2024, 11:15 AM',
    text: "We're sorry about this. Could you share a short video of the unboxing and the damaged edges?",
  },
  {
    id: 'dm3',
    author: 'Alex Johnson',
    roleLabel: 'Buyer',
    role: 'buyer',
    align: 'right',
    at: '3/15/2024, 12:02 PM',
    text: 'I uploaded two photos under Evidence. Happy to record a video if needed.',
  },
  {
    id: 'dm4',
    author: 'Tech Haven',
    roleLabel: 'Admin',
    role: 'admin',
    align: 'left',
    at: '3/15/2024, 1:40 PM',
    text: 'Thanks — we have opened a review case. We will confirm replacement or refund within 48 hours.',
  },
]

/** Public end — status + created on description card */
export const DEMO_DISPUTE_PUBLIC = {
  id: 'dsp-1001',
  status: 'under_review',
  createdAt: '3/15/2024, 2:10 PM',
  description:
    'The materials delivered show significant structural damage. The marble slabs have visible cracks, and the wooden beams are not cut to the specified dimensions.',
  items: [
    {
      id: 'di1',
      productName: 'Premium Marble Slabs',
      orderId: 'ORD-5521',
      reason: 'Damaged Item',
      image: DISPUTE_IMG_MARBLE,
    },
    {
      id: 'di2',
      productName: 'Polished Granite Blocks',
      orderId: 'ORD-5521',
      reason: 'Damaged Item',
      image: DISPUTE_IMG_GRANITE,
    },
  ],
  evidence: [DISPUTE_EVIDENCE_1, DISPUTE_EVIDENCE_2],
  messages: DEMO_DISPUTE_MESSAGES,
}

/** Dashboard — page header + status pills in composer */
export const DEMO_DISPUTE_DASHBOARD = {
  ...DEMO_DISPUTE_PUBLIC,
  id: 'dsp-1002',
  items: [
    {
      id: 'di1',
      productName: 'Premium Marble Slabs',
      orderId: 'ORD-5521',
      reason: 'Damaged Item',
      image: DISPUTE_IMG_MARBLE,
    },
  ],
}

// ── Delivery timeline ──────────────────────────────────────────────
export const DEMO_DELIVERY_TIMELINE_ITEMS = [
  {
    id: 'dl-001',
    title: 'Premium Portland Cement',
    orderLabel: 'Auction ID: AUC-001',
    price: '$8,500',
    distance: '32 km',
    status: 'assigned',
    pickup: {
      title: 'Ambuja Cement Factory',
      subtitle: 'Plot 45, MIDC Kalyan, Maharashtra 421301',
    },
    delivery: {
      title: 'Metro Construction Pvt Ltd',
      subtitle: 'Site 12, Andheri West, Mumbai 400053',
    },
  },
  {
    id: 'dl-002',
    title: 'TMT Steel Rods ( 12mm )',
    orderLabel: 'Auction ID: AUC-002',
    price: '$5,500',
    distance: '18 km',
    status: 'picked_up',
    pickup: {
      title: 'Tata Steel Depot',
      subtitle: 'Sector 11, Turbhe, Navi Mumbai 400705',
    },
    delivery: {
      title: 'Skyline Residency Project',
      subtitle: 'Plot 8, Sector 20, Kharghar, Navi Mumbai 410210',
    },
  },
  {
    id: 'dl-003',
    title: 'Red Bricks',
    orderLabel: 'Auction ID: AUC-003',
    price: '$8,500',
    distance: '18 km',
    status: 'in_transit',
    pickup: {
      title: 'Brick Kiln Industries',
      subtitle: 'Vasai East, Palghar 401208',
    },
    delivery: {
      title: 'Villa Paradise Construction',
      subtitle: 'Mira Road, Thane 401107',
    },
  },
  {
    id: 'dl-004',
    title: 'Ready Mix Concrete',
    orderLabel: 'Delivery ID: DL-004',
    price: '$6,200',
    distance: '12 km',
    status: 'delivered',
    pickup: {
      title: 'UltraMix Concrete Plant',
      subtitle: 'Ghodbunder Road, Thane 400607',
    },
    delivery: {
      title: 'Sunrise Tower Project',
      subtitle: 'Pokhran Road, Thane 400606',
    },
  },
]

// ── Panel profile ─────────────────────────────────────────────────
export const DEMO_PANEL_PROFILE = {
  displayName: 'Chowdhury Group Of Industries',
  displayEmail: 'chowdhury@gmail.com',
  name: 'John Industries',
  email: 'admin@johnindustries.com',
  phone: '+1 (555) 000-1122',
  warehouses: [
    {
      id: 'wh-1',
      label: 'Warehouse 1',
      address: '4140 Forest Rd. Abilene, New Mexico 21134',
    },
  ],
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  iban: '',
  ibanPhone: '',
  avatarUrl: null,
}

export const DEMO_PANEL_PROFILE_SUPPLIER = { ...DEMO_PANEL_PROFILE }
export const DEMO_PANEL_PROFILE_FACTORY = {
  ...DEMO_PANEL_PROFILE,
  displayName: 'UltraMix Concrete Plant',
  displayEmail: 'factory@demo.com',
  name: 'UltraMix Factory',
  email: 'factory@demo.com',
}
export const DEMO_PANEL_PROFILE_TRANSPORTER = {
  ...DEMO_PANEL_PROFILE,
  displayName: 'Swift Logistics',
  displayEmail: 'transporter@demo.com',
  name: 'Swift Logistics',
  email: 'transporter@demo.com',
  phone: '+1 (555) 220-3344',
  warehouses: [],
}
export const DEMO_PANEL_PROFILE_ADMIN = {
  ...DEMO_PANEL_PROFILE,
  warehouses: [],
}
export const DEMO_PANEL_PROFILE_AFFILIATE = {
  ...DEMO_PANEL_PROFILE,
  displayName: 'Affiliate Partner',
  displayEmail: 'affiliate@demo.com',
  name: 'Affiliate Partner',
  email: 'affiliate@demo.com',
  phone: '+1 (555) 440-5566',
  warehouses: [],
}

const DEMO_BUYER_ADDRESS_BASE = {
  firstName: 'Kevin',
  lastName: 'Gilbert',
  companyName: '',
  address: 'Road No. 13/x, House no. 1320/C, Flat No. 5D',
  region: 'lisbon',
  city: 'lisbon-city',
  zipCode: '1207',
  phone: '+1-202-555-0118',
}

export const DEMO_PANEL_PROFILE_CUSTOMER = {
  firstName: 'Kevin',
  lastName: '',
  email: 'customer@gmail.com',
  phone: '+1-202-555-0118',
  region: 'lisbon',
  city: 'lisbon-city',
  zipCode: '1000',
  address: 'Road No. 13/x, House no. 1320/C, Flat No. 5D',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  iban: '',
  ibanPhone: '',
  avatarUrl: null,
  billingAddress: {
    ...DEMO_BUYER_ADDRESS_BASE,
    email: 'customer@example.com',
  },
  shippingAddress: {
    ...DEMO_BUYER_ADDRESS_BASE,
    email: 'customer@gmail.com',
  },
}

export const DEMO_PANEL_PROFILE_COMPANY = {
  ...DEMO_PANEL_PROFILE_CUSTOMER,
  email: 'company@construpreco.com',
  billingAddress: {
    ...DEMO_BUYER_ADDRESS_BASE,
    companyName: 'Chowdhury Construction Ltd.',
    email: 'company@construpreco.com',
  },
  shippingAddress: {
    ...DEMO_BUYER_ADDRESS_BASE,
    companyName: 'Chowdhury Construction Ltd.',
    email: 'company@construpreco.com',
  },
}
