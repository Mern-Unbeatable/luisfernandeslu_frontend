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
  FiInfo,
  FiPackage,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi';

// ── Auth ──────────────────────────────────────────────────────────
export const DEMO_PASSWORD = 'demo123';

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
];

const BUYER_ROLES = new Set(['customer', 'company']);

// ── Product details ───────────────────────────────────────────────
const IMG_MAIN =
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80';
const IMG_2 =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80';
const IMG_3 =
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80';
const IMG_4 =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80';
const AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80';

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
};

/** Admin-facing seller label override */
export const ADMIN_PRODUCT = {
  ...DEMO_PRODUCT,
  seller: {
    ...DEMO_PRODUCT.seller,
    name: 'A2A Construction Supplies',
  },
};

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
];

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
];

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
];

const baseCompany = {
  name: 'ABC CORP',
  email: 'abccorp@gmail.com',
  phone: '+123 765 3490',
  project: 'Downtown Office Complex',
  taxId: 'TX-998877',
};

const baseTransporter = {
  name: 'Esther Howard',
  email: 'bill.sanders@example.com',
  phone: '(385) 555-0121',
  vehicle: 'Truck #TR-2034',
  initials: 'EH',
};

const baseLogistics = {
  deliveryLocation: '123 Main St, Downtown',
  pickupLocation: 'Downtown Office Complex',
  unloadingType: 'Tipper truck',
  accessCondition: 'Manual Unloading',
};

const baseTotals = {
  grandTotal: '$5,873.00',
  shipping: '$1,200.00',
  total: '$7,073.00',
};

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
};

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
};

/** hasInstallment=false · Assigned */
export const DEMO_ORDER_ASSIGNED = {
  ...DEMO_ORDER_PENDING,
  status: 'assigned',
  transporter: baseTransporter,
};

/** hasInstallment=false · Cancel */
export const DEMO_ORDER_CANCEL = {
  ...DEMO_ORDER_ASSIGNED,
  status: 'cancel',
  cancelReason:
    'Order has been cancelled by the customer as the requirement has been updated and the purchase is no longer needed.',
};

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
};

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
};

/**
 * Installment order demo used for “No Pay” preview (showPay omitted / false).
 */
export const DEMO_ORDER_INSTALLMENT_SUPPLIER = {
  ...DEMO_ORDER_INSTALLMENT_ASSIGNED,
  id: 'ORD-SUP-001',
  orderId: 'ORD-SUP-001',
};

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
];

// ── Auction cards ─────────────────────────────────────────────────
export const DEMO_AUCTION_CREATED = {
  id: 'auc-ord-001',
  orderId: 'ORD-2026-001',
  pickupLocation: '1234 Main St, Los Angeles, CA',
  customerName: 'John Smith',
  deliveryLocation: '5678 Oak Ave, San Francisco, CA',
  productName: 'Construction Materials - Steel Beams',
  status: 'open',
};

export const DEMO_AUCTION_ASSIGNED = {
  id: 'auc-ord-002',
  orderId: 'ORD-2026-002',
  productName: 'Heavy Machinery - Excavator',
  pickupLocation: '890 Industrial Blvd, Houston, TX',
  deliveryLocation: '2345 Commerce St, Dallas, TX',
  assignedTransporter: 'Swift Transport Co.',
  bidPrice: 4500,
  status: 'assigned',
};

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
    {
      id: 'b1',
      amount: 285,
      label: 'Just now',
      at: '5/20/2026, 4:16:01 PM',
      transporterName: 'FastShip Logistics',
    },
    {
      id: 'b2',
      amount: 290,
      label: '1 min ago',
      at: '5/20/2026, 4:15:01 PM',
      transporterName: 'Swift Transport Co.',
    },
    {
      id: 'b3',
      amount: 310,
      label: '3 min ago',
      at: '5/20/2026, 4:13:01 PM',
      transporterName: 'RoadRunner Freight',
    },
    {
      id: 'b4',
      amount: 320,
      label: '4 min ago',
      at: '5/20/2026, 4:12:01 PM',
      transporterName: 'HaulMaster Inc.',
    },
  ],
};

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
};

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
};

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
};

export const DEMO_AUCTION_DETAILS_TRANSPORTER_COMPLETE = {
  ...DEMO_AUCTION_DETAILS_TRANSPORTER,
  id: 'auc-det-004',
  status: 'complete',
  currentStatus: 'complete',
};

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
};

export const DEMO_STATUS_CARD_LIST = Object.entries(DEMO_STATUS_CARDS).map(
  ([id, props]) => ({ id, ...props }),
);

// ── Supplier dashboard ────────────────────────────────────────────
export const DEMO_SUPPLIER_DASHBOARD = {
  stats: {
    totalSalesRegular: 128430,
    totalSalesCompany: 128430,
    activeOrders: 45,
    cancelOrders: 40,
    totalProducts: 156,
  },
  revenue: {
    maxValue: 10000,
    yTicks: [0, 2500, 5000, 7500, 10000],
    series: [
      {
        id: 'customer',
        color: '#7C3AED',
        points: [
          { month: 'Jan', value: 3200 },
          { month: 'Feb', value: 4100 },
          { month: 'Mar', value: 3800 },
          { month: 'Apr', value: 4500 },
          { month: 'May', value: 5600 },
          { month: 'Jun', value: 5200 },
          { month: 'Jul', value: 4800 },
          { month: 'Aug', value: 6100 },
          { month: 'Sep', value: 5500 },
          { month: 'Oct', value: 6800 },
          { month: 'Nov', value: 7200 },
          { month: 'Dec', value: 8000 },
        ],
      },
      {
        id: 'company',
        color: '#10B981',
        points: [
          { month: 'Jan', value: 3500 },
          { month: 'Feb', value: 4200 },
          { month: 'Mar', value: 4000 },
          { month: 'Apr', value: 4800 },
          { month: 'May', value: 5900 },
          { month: 'Jun', value: 5400 },
          { month: 'Jul', value: 5000 },
          { month: 'Aug', value: 6400 },
          { month: 'Sep', value: 5800 },
          { month: 'Oct', value: 7000 },
          { month: 'Nov', value: 7500 },
          { month: 'Dec', value: 8500 },
        ],
      },
    ],
  },
  orders: [
    {
      id: 'ord-001',
      orderId: '#ORD-001',
      customerName: 'Darlene Robertson',
      type: 'Regular',
      price: '$12500',
      payment: 'Paid',
      status: 'assign',
      statusLabel: 'Assign',
    },
    {
      id: 'ord-002',
      orderId: '#ORD-002',
      customerName: 'Cameron Williamson',
      type: 'Company',
      price: '$1,200',
      payment: 'Installment Active',
      status: 'completed',
      statusLabel: 'Completed',
    },
    {
      id: 'ord-003',
      orderId: '#ORD-003',
      customerName: 'Theresa Webb',
      type: 'Regular',
      price: '$850',
      payment: 'Paid',
      status: 'pending',
      statusLabel: 'Pending',
    },
    {
      id: 'ord-004',
      orderId: '#ORD-004',
      customerName: 'Ronnie Rivers',
      type: 'Company',
      price: '$5,400',
      payment: 'Paid',
      status: 'assign',
      statusLabel: 'Assign',
    },
    {
      id: 'ord-005',
      orderId: '#ORD-005',
      customerName: 'Courtney Henry',
      type: 'Company',
      price: '$250000',
      payment: 'Installment Active',
      status: 'cancel',
      statusLabel: 'Cancel',
    },
    {
      id: 'ord-006',
      orderId: '#ORD-006',
      customerName: 'Frances Swann',
      type: 'Regular',
      price: '$3,200',
      payment: 'Paid',
      status: 'completed',
      statusLabel: 'Completed',
    },
    {
      id: 'ord-007',
      orderId: '#ORD-007',
      customerName: 'Marvin Kinney',
      type: 'Regular',
      price: '$980',
      payment: 'Installment Active',
      status: 'pending',
      statusLabel: 'Pending',
    },
  ],
};

export const DEMO_SUPPLIER_DASHBOARD_STAT_CARDS = [
  {
    id: 'totalSalesRegular',
    labelKey: 'panel.supplierDashboard.totalSalesRegular',
    valueKey: 'totalSalesRegular',
    format: 'currency',
    icon: FiDollarSign,
    iconTone: 'success',
  },
  {
    id: 'totalSalesCompany',
    labelKey: 'panel.supplierDashboard.totalSalesCompany',
    valueKey: 'totalSalesCompany',
    format: 'currency',
    icon: FiDollarSign,
    iconTone: 'success',
  },
  {
    id: 'activeOrders',
    labelKey: 'panel.supplierDashboard.activeOrders',
    valueKey: 'activeOrders',
    format: 'number',
    icon: FiShoppingBag,
    iconTone: 'brand',
  },
  {
    id: 'cancelOrders',
    labelKey: 'panel.supplierDashboard.cancelOrders',
    valueKey: 'cancelOrders',
    format: 'number',
    icon: FiShoppingBag,
    iconTone: 'red',
  },
  {
    id: 'totalProducts',
    labelKey: 'panel.supplierDashboard.totalProducts',
    valueKey: 'totalProducts',
    format: 'number',
    icon: FiPackage,
    iconTone: 'blue',
  },
];

// ── Supplier regular customer orders ──────────────────────────────
export const DEMO_SUPPLIER_CUSTOMER_ORDERS = {
  stats: {
    totalOrders: 127,
    pending: 18,
    processing: 24,
    completed: 85,
  },
  orders: [
    {
      id: 'co-001',
      orderId: '#ORD-101',
      customerName: 'Darlene Robertson',
      email: 'darlene@example.com',
      items: '3',
      total: '$1,250.00',
      status: 'new',
      statusLabel: 'New',
      date: '01/15/2026',
    },
    {
      id: 'co-002',
      orderId: '#ORD-102',
      customerName: 'Cameron Williamson',
      email: 'cameron@example.com',
      items: '2',
      total: '$890.00',
      status: 'pending',
      statusLabel: 'Pending',
      date: '01/16/2026',
    },
    {
      id: 'co-003',
      orderId: '#ORD-103',
      customerName: 'Theresa Webb',
      email: 'theresa@example.com',
      items: '5',
      total: '$2,340.00',
      status: 'processing',
      statusLabel: 'Processing',
      date: '01/17/2026',
    },
    {
      id: 'co-004',
      orderId: '#ORD-104',
      customerName: 'Ronnie Rivers',
      email: 'ronnie@example.com',
      items: '1',
      total: '$450.00',
      status: 'assigned',
      statusLabel: 'Assigned',
      date: '01/18/2026',
    },
    {
      id: 'co-005',
      orderId: '#ORD-105',
      customerName: 'Courtney Henry',
      email: 'courtney@example.com',
      items: '4',
      total: '$3,120.00',
      status: 'cancel',
      statusLabel: 'Cancel',
      date: '01/19/2026',
    },
    {
      id: 'co-006',
      orderId: '#ORD-106',
      customerName: 'Frances Swann',
      email: 'frances@example.com',
      items: '6',
      total: '$4,800.00',
      status: 'completed',
      statusLabel: 'Completed',
      date: '01/20/2026',
    },
    {
      id: 'co-007',
      orderId: '#ORD-107',
      customerName: 'Marvin Kinney',
      email: 'marvin@example.com',
      items: '2',
      total: '$675.00',
      status: 'pending',
      statusLabel: 'Pending',
      date: '01/21/2026',
    },
  ],
};

export const DEMO_SUPPLIER_CUSTOMER_ORDERS_STAT_CARDS = [
  {
    id: 'totalOrders',
    labelKey: 'panel.supplierCustomerOrders.totalOrders',
    valueKey: 'totalOrders',
    variant: 'summary',
    icon: FiPackage,
    iconTone: 'blue',
  },
  {
    id: 'pending',
    labelKey: 'panel.supplierCustomerOrders.pending',
    valueKey: 'pending',
    variant: 'badge',
    tone: 'warning',
  },
  {
    id: 'processing',
    labelKey: 'panel.supplierCustomerOrders.processing',
    valueKey: 'processing',
    variant: 'summary',
    icon: FiShoppingBag,
    iconTone: 'blue',
  },
  {
    id: 'completed',
    labelKey: 'panel.supplierCustomerOrders.completed',
    valueKey: 'completed',
    variant: 'badge',
    tone: 'success',
  },
];

export const SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE = 7;

const SUPPLIER_CUSTOMER_ORDER_CUSTOMER = {
  name: 'Zarah Islam',
  email: 'zaraislam@gmail.com',
  phone: '+123 765 3490',
  region: 'America',
  city: 'America',
  zipCode: '095764',
  address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
};

/** Full order payload for supplier customer order detail page */
export function getSupplierCustomerOrderDetail(orderId, statusOverride) {
  const listOrder = DEMO_SUPPLIER_CUSTOMER_ORDERS.orders.find(
    (order) => order.id === orderId,
  );
  if (!listOrder) return null;

  const status = statusOverride || listOrder.status;
  const orderIdDisplay = listOrder.orderId.replace(/^#/, '');

  const detail = {
    id: listOrder.id,
    orderId: orderIdDisplay,
    orderDate: '2026-05-01',
    status,
    hasInstallment: false,
    recipientType: 'customer',
    customer: SUPPLIER_CUSTOMER_ORDER_CUSTOMER,
    logistics: baseLogistics,
    products: DEMO_ORDER_PRODUCTS,
    totals: baseTotals,
    transporter: null,
    cancelReason: null,
  };

  if (status === 'assigned' || status === 'cancel') {
    detail.transporter = baseTransporter;
  }

  if (status === 'cancel') {
    detail.cancelReason =
      'Order has been cancelled by the customer as the requirement has been updated and the purchase is no longer needed.';
  }

  return detail;
}

// ── Supplier company orders (B2B) ─────────────────────────────────
export const DEMO_SUPPLIER_COMPANY_ORDER_COMPANIES = [
  { value: 'abc-corp', label: 'ABC Corp' },
  { value: 'xyz-industries', label: 'XYZ Industries' },
  { value: 'global-builders', label: 'Global Builders' },
  { value: 'prime-construct', label: 'Prime Construct' },
  { value: 'metro-build', label: 'Metro Build Ltd' },
];

export const DEMO_SUPPLIER_COMPANY_ORDERS = {
  stats: {
    direct: {
      totalOrders: 127,
      pending: 18,
      processing: 24,
      completed: 85,
    },
    chat: {
      activeCompanyOrders: 42,
      totalB2bRevenue: '$128,940',
      installmentActive: '18 orders',
      paymentOverdue: '$12,400',
      paymentOverdueOrders: '3 orders',
    },
  },
  orders: [
    {
      id: 'b2b-d01',
      tab: 'direct',
      companyId: 'abc-corp',
      orderId: 'COM-1001',
      customerName: 'ABC Corp',
      email: 'john@example.com',
      items: '3',
      total: '$450',
      status: 'new',
      statusLabel: 'New',
      date: '2026-05-01',
    },
    {
      id: 'b2b-d02',
      tab: 'direct',
      companyId: 'xyz-industries',
      orderId: 'COM-1002',
      customerName: 'XYZ Industries',
      email: 'sarah@example.com',
      items: '5',
      total: '$320',
      status: 'pending',
      statusLabel: 'Pending',
      date: '2026-05-02',
    },
    {
      id: 'b2b-d03',
      tab: 'direct',
      companyId: 'global-builders',
      orderId: 'COM-1003',
      customerName: 'Global Builders',
      email: 'mike@example.com',
      items: '2',
      total: '$890',
      status: 'processing',
      statusLabel: 'Processing',
      date: '2026-05-03',
    },
    {
      id: 'b2b-d04',
      tab: 'direct',
      companyId: 'prime-construct',
      orderId: 'COM-1004',
      customerName: 'Prime Construct',
      email: 'lisa@example.com',
      items: '4',
      total: '$1,250',
      status: 'assigned',
      statusLabel: 'Assigned',
      date: '2026-05-04',
    },
    {
      id: 'b2b-d05',
      tab: 'direct',
      companyId: 'metro-build',
      orderId: 'COM-1005',
      customerName: 'Metro Build Ltd',
      email: 'david@example.com',
      items: '1',
      total: '$675',
      status: 'cancel',
      statusLabel: 'Cancel',
      date: '2026-05-05',
    },
    {
      id: 'b2b-d06',
      tab: 'direct',
      companyId: 'abc-corp',
      orderId: 'COM-1006',
      customerName: 'ABC Corp',
      email: 'emma@example.com',
      items: '6',
      total: '$4,800',
      status: 'completed',
      statusLabel: 'Completed',
      date: '2026-05-06',
    },
    {
      id: 'b2b-d07',
      tab: 'direct',
      companyId: 'xyz-industries',
      orderId: 'COM-1007',
      customerName: 'XYZ Industries',
      email: 'james@example.com',
      items: '2',
      total: '$540',
      status: 'pending',
      statusLabel: 'Pending',
      date: '2026-05-07',
    },
    {
      id: 'b2b-c01',
      tab: 'chat',
      companyId: 'abc-corp',
      orderId: 'CO-1001',
      companyName: 'ABC Corp',
      total: '$4,500,000',
      installmentAmount: '$4,500',
      status: 'new',
      statusLabel: 'New',
      installmentNumber: '1',
      date: '2026-05-01',
    },
    {
      id: 'b2b-c02',
      tab: 'chat',
      companyId: 'xyz-industries',
      orderId: 'CO-1002',
      companyName: 'XYZ Industries',
      total: '$180,345,546',
      installmentAmount: '$180,345',
      status: 'pending',
      statusLabel: 'Pending',
      installmentNumber: '2',
      date: '2026-05-02',
    },
    {
      id: 'b2b-c03',
      tab: 'chat',
      companyId: 'global-builders',
      orderId: 'CO-1003',
      companyName: 'Global Builders',
      total: '$2,890,000',
      installmentAmount: '$481,667',
      status: 'processing',
      statusLabel: 'Processing',
      installmentNumber: '3',
      date: '2026-05-03',
    },
    {
      id: 'b2b-c04',
      tab: 'chat',
      companyId: 'prime-construct',
      orderId: 'CO-1004',
      companyName: 'Prime Construct',
      total: '$1,250,000',
      installmentAmount: '$208,333',
      status: 'assigned',
      statusLabel: 'Assigned',
      installmentNumber: '4',
      date: '2026-05-04',
    },
    {
      id: 'b2b-c05',
      tab: 'chat',
      companyId: 'metro-build',
      orderId: 'CO-1005',
      companyName: 'Metro Build Ltd',
      total: '$675,000',
      installmentAmount: '$112,500',
      status: 'cancel',
      statusLabel: 'Cancel',
      installmentNumber: '5',
      date: '2026-05-05',
    },
    {
      id: 'b2b-c06',
      tab: 'chat',
      companyId: 'abc-corp',
      orderId: 'CO-1006',
      companyName: 'ABC Corp',
      total: '$4,800,000',
      installmentAmount: '$800,000',
      status: 'completed',
      statusLabel: 'Completed',
      installmentNumber: '6',
      date: '2026-05-06',
    },
    {
      id: 'b2b-c07',
      tab: 'chat',
      companyId: 'xyz-industries',
      orderId: 'CO-1007',
      companyName: 'Tech Solutions Ltd',
      total: '$540,000',
      installmentAmount: '$90,000',
      status: 'pending',
      statusLabel: 'Pending',
      installmentNumber: '7',
      date: '2026-05-07',
    },
  ],
};

const CHAT_ORDER_INSTALLMENT_ORDINALS = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
];

const CHAT_ORDER_INSTALLMENT_BREAKDOWN = CHAT_ORDER_INSTALLMENT_ORDINALS.map(
  (ordinal, index) => ({
    id: `chat-ib-${index + 1}`,
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    installmentNumber: `${ordinal} Installment`,
    amount: '$9,113.00',
  }),
);

const CHAT_ORDER_PRODUCTS = [
  {
    id: 'chat-p1',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '180 bags',
    unit: '$50.75',
    warehouse: '4140 Parker Rd. Allentown, New Mexico 31134',
    total: '$9,113.00',
  },
];

const COMPANY_DIRECT_STATUS_TEMPLATES = {
  new: { ...DEMO_ORDER_PENDING, status: 'new', transporter: null, cancelReason: null },
  pending: { ...DEMO_ORDER_PENDING, transporter: null, cancelReason: null },
  processing: {
    ...DEMO_ORDER_PENDING,
    status: 'processing',
    transporter: null,
    cancelReason: null,
  },
  assigned: DEMO_ORDER_ASSIGNED,
  cancel: DEMO_ORDER_CANCEL,
  completed: {
    ...DEMO_ORDER_PENDING,
    status: 'completed',
    transporter: null,
    cancelReason: null,
  },
};

/** Full order payload for supplier company order detail (direct or chat) */
export function getSupplierCompanyOrderDetail(orderId, statusOverride) {
  const listOrder = DEMO_SUPPLIER_COMPANY_ORDERS.orders.find(
    (order) => order.id === orderId,
  );
  if (!listOrder) return null;

  const status = statusOverride || listOrder.status;
  const orderDate = listOrder.date;

  if (listOrder.tab === 'direct') {
    const template =
      COMPANY_DIRECT_STATUS_TEMPLATES[status] ||
      COMPANY_DIRECT_STATUS_TEMPLATES.pending;

    return {
      ...template,
      id: listOrder.id,
      orderId: listOrder.orderId,
      orderDate,
      status,
      hasInstallment: false,
    };
  }

  const installmentStatus =
    status === 'completed' ? 'paid' : status === 'cancel' ? 'cancel' : status;

  const chatPaymentNew = {
    totalPrice: '$125,500',
    paidAmount: '$25,100',
    remainingBalance: '$100,400',
    paidNote: 'Pay $10,040/month for 10 months',
    duration: '10 months',
  };

  const chatPaymentAssigned = {
    totalPrice: '$125,500',
    paidAmount: '$25,100',
    remainingBalance: '$100,400',
    paidNote: 'Last installment paid on 12-05-24',
    nextDueLabel: 'Next installment due on May 15, 2024',
    duration: '10 months',
  };

  const CHAT_ORDER_DRIVER = {
    name: 'John Smith',
    phone: '+1 (555) 123-4567',
    vehicle: 'Truck #TR-4523',
  };

  const transporter =
    installmentStatus === 'cancel' ? null : CHAT_ORDER_DRIVER;

  const detailOrderId =
    installmentStatus === 'new' ? 'ORD-001' : listOrder.orderId;

  return {
    ...DEMO_ORDER_INSTALLMENT_NEW,
    id: listOrder.id,
    orderId: detailOrderId,
    orderDate,
    status: installmentStatus,
    hasInstallment: true,
    role: 'company',
    company: {
      ...baseCompany,
      email: 'abccorp@gmail.com',
      phone: '+123 765 3490',
    },
    logistics: baseLogistics,
    payment:
      installmentStatus === 'new'
        ? chatPaymentNew
        : installmentStatus === 'assigned'
          ? chatPaymentAssigned
          : {
              ...DEMO_ORDER_INSTALLMENT_NEW.payment,
              totalPrice: listOrder.total,
            },
    products: CHAT_ORDER_PRODUCTS,
    installmentBreakdown: CHAT_ORDER_INSTALLMENT_BREAKDOWN,
    installments: DEMO_ORDER_INSTALLMENTS,
    transporter,
    totals: null,
    cancelReason:
      installmentStatus === 'cancel'
        ? DEMO_ORDER_CANCEL.cancelReason
        : null,
  };
}

export const DEMO_SUPPLIER_COMPANY_ORDERS_DIRECT_STAT_CARDS = [
  {
    id: 'totalOrders',
    labelKey: 'panel.supplierCompanyOrders.totalOrders',
    valueKey: 'totalOrders',
    variant: 'summary',
    icon: FiPackage,
    iconTone: 'blue',
  },
  {
    id: 'pending',
    labelKey: 'panel.supplierCompanyOrders.pending',
    valueKey: 'pending',
    variant: 'badge',
    tone: 'warning',
  },
  {
    id: 'processing',
    labelKey: 'panel.supplierCompanyOrders.processing',
    valueKey: 'processing',
    variant: 'summary',
    icon: FiShoppingBag,
    iconTone: 'blue',
  },
  {
    id: 'completed',
    labelKey: 'panel.supplierCompanyOrders.completed',
    valueKey: 'completed',
    variant: 'badge',
    tone: 'success',
  },
];

export const DEMO_SUPPLIER_COMPANY_ORDERS_CHAT_STAT_CARDS = [
  {
    id: 'activeCompanyOrders',
    labelKey: 'panel.supplierCompanyOrders.activeCompanyOrders',
    valueKey: 'activeCompanyOrders',
    variant: 'summary',
    icon: FiPackage,
    iconTone: 'blue',
  },
  {
    id: 'totalB2bRevenue',
    labelKey: 'panel.supplierCompanyOrders.totalB2bRevenue',
    valueKey: 'totalB2bRevenue',
    variant: 'summary',
    icon: FiDollarSign,
    iconTone: 'success',
  },
  {
    id: 'installmentActive',
    labelKey: 'panel.supplierCompanyOrders.installmentActive',
    valueKey: 'installmentActive',
    variant: 'summary',
    icon: FiInfo,
    iconTone: 'blue',
  },
  {
    id: 'paymentOverdue',
    labelKey: 'panel.supplierCompanyOrders.paymentOverdue',
    valueKey: 'paymentOverdue',
    descriptionKey: 'paymentOverdueOrders',
    variant: 'status',
    tone: 'danger',
    icon: FiAlertCircle,
  },
];

export const SUPPLIER_COMPANY_ORDERS_PAGE_SIZE = 7;

// ── Supplier factory orders ───────────────────────────────────────
export const DEMO_SUPPLIER_FACTORY_ORDER_COMPANIES = [
  { value: 'abc-corp', label: 'ABC Corp' },
  { value: 'xyz-industries', label: 'XYZ Industries' },
  { value: 'tech-solutions', label: 'Tech Solutions Ltd' },
  { value: 'global-manufacturing', label: 'Global Manufacturing' },
  { value: 'maktach', label: 'MAKTACH' },
  { value: 'chowdhury', label: 'Chowdhury Industries' },
  { value: 'swift-logistics', label: 'Swift Logistics' },
  { value: 'porto-haul', label: 'Porto Haul' },
];

export const DEMO_SUPPLIER_FACTORY_ORDERS = {
  orders: [
    {
      id: 'fo-01',
      tab: 'orders',
      companyId: 'abc-corp',
      poNumber: 'PO-2001',
      factoryName: 'ABC Corp',
      total: '$4,500,000',
      installmentAmount: '$4,500',
      status: 'produced',
      statusLabel: 'Produced',
      installmentNumber: '1',
      date: '2026-05-01',
    },
    {
      id: 'fo-02',
      tab: 'orders',
      companyId: 'xyz-industries',
      poNumber: 'PO-2002',
      factoryName: 'XYZ Industries',
      total: '$3,201,800',
      installmentAmount: '$3,201',
      status: 'in-production',
      statusLabel: 'In Production',
      installmentNumber: '2',
      date: '2026-04-30',
    },
    {
      id: 'fo-03',
      tab: 'orders',
      companyId: 'tech-solutions',
      poNumber: 'PO-2003',
      factoryName: 'Tech Solutions Ltd',
      total: '$180,345,546',
      installmentAmount: '$180,345',
      status: 'ready',
      statusLabel: 'Ready',
      installmentNumber: '3',
      date: '2026-04-29',
    },
    {
      id: 'fo-04',
      tab: 'orders',
      companyId: 'global-manufacturing',
      poNumber: 'PO-2004',
      factoryName: 'Global Manufacturing',
      total: '$56,037,890',
      installmentAmount: '$5,600',
      status: 'assigned',
      statusLabel: 'Assigned',
      installmentNumber: '4',
      date: '2026-04-28',
    },
    {
      id: 'fo-05',
      tab: 'orders',
      companyId: 'maktach',
      poNumber: 'PO-2004',
      factoryName: 'MAKTACH',
      total: '$95,456,453',
      installmentAmount: '$9,545',
      status: 'cancel',
      statusLabel: 'Cancel',
      installmentNumber: '5',
      date: '2026-04-27',
    },
    {
      id: 'fo-06',
      tab: 'orders',
      companyId: 'chowdhury',
      poNumber: 'CO-1005',
      factoryName: 'Chowdhury Industries',
      total: '$95,765,456',
      installmentAmount: '$95,765',
      status: 'completed',
      statusLabel: 'Completed',
      installmentNumber: '6',
      date: '2026-04-30',
    },
    {
      id: 'fo-07',
      tab: 'orders',
      companyId: 'abc-corp',
      poNumber: 'PO-2005',
      factoryName: 'ABC Corp',
      total: '$870,000',
      installmentAmount: '$870',
      status: 'ready',
      statusLabel: 'Ready',
      installmentNumber: '2',
      date: '2026-04-26',
    },
    {
      id: 'fo-tr-01',
      tab: 'transport',
      companyId: 'abc-corp',
      poNumber: 'PO-2001',
      factoryName: 'ABC Corp',
      product: 'UltraSet Portland Cement',
      qty: '30 Bags',
      weightSize: '50 kg bag, OPC 53 grade',
      shippingCharge: '$1200',
      transportStatus: 'pending',
    },
    {
      id: 'fo-tr-02',
      tab: 'transport',
      companyId: 'xyz-industries',
      poNumber: 'PO-2002',
      factoryName: 'XYZ Industries',
      product: 'UltraSet Portland Cement',
      qty: '20 Bags',
      weightSize: '50 kg bag, OPC 53 grade',
      shippingCharge: '$1000',
      transportStatus: 'pending',
    },
    {
      id: 'fo-tr-03',
      tab: 'transport',
      companyId: 'tech-solutions',
      poNumber: 'PO-2003',
      factoryName: 'Tech Solutions Ltd',
      product: 'UltraSet Portland Cement',
      qty: '50 Bags',
      weightSize: '50 kg bag, OPC 53 grade',
      shippingCharge: '$800',
      transportStatus: 'pending',
    },
    {
      id: 'fo-tr-04',
      tab: 'transport',
      companyId: 'global-manufacturing',
      poNumber: 'PO-2004',
      factoryName: 'Global Manufacturing',
      product: 'UltraSet Portland Cement',
      qty: '70 Bags',
      weightSize: '50 kg bag, OPC 53 grade',
      shippingCharge: '$4000',
      transportStatus: 'pending',
    },
    {
      id: 'fo-tr-05',
      tab: 'transport',
      companyId: 'maktach',
      poNumber: 'PO-2004',
      factoryName: 'MAKTACH',
      product: 'UltraSet Portland Cement',
      qty: '90 Bags',
      weightSize: '50 kg bag, OPC 53 grade',
      shippingCharge: '$6000',
      transportStatus: 'pending',
    },
    {
      id: 'fo-tr-06',
      tab: 'transport',
      companyId: 'chowdhury',
      poNumber: 'CO-1005',
      factoryName: 'Chowdhury Industries',
      product: 'UltraSet Portland Cement',
      qty: '100 Bags',
      weightSize: '50 kg bag, OPC 53 grade',
      shippingCharge: '$8000',
      transportStatus: 'pending',
    },
    {
      id: 'fo-tr-07',
      tab: 'transport',
      companyId: 'abc-corp',
      poNumber: 'PO-2005',
      factoryName: 'ABC Corp',
      product: 'UltraSet Portland Cement',
      qty: '40 Bags',
      weightSize: '50 kg bag, OPC 53 grade',
      shippingCharge: '$1500',
      transportStatus: 'pending',
    },
  ],
};

export const SUPPLIER_FACTORY_ORDERS_PAGE_SIZE = 7;

const FACTORY_ORDER_PRODUCTS = [
  {
    id: 'factory-p1',
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '180 bags',
    unit: '$50.75',
    total: '$9,113.00',
  },
];

const FACTORY_ORDER_INSTALLMENT_BREAKDOWN = CHAT_ORDER_INSTALLMENT_ORDINALS.map(
  (ordinal, index) => ({
    id: `factory-ib-${index + 1}`,
    product: 'UltraSet Portland Cement',
    category: 'Binding Materials',
    material: 'Cement',
    weightSize: '50 kg bag, OPC 53 grade',
    qty: '30 bags',
    installmentNumber: `${ordinal} Installment`,
    amount: '$9,113.00',
  }),
);

export const DEMO_FACTORY_ORDER_INSTALLMENTS = [
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
    canPayNow: true,
  },
  {
    id: '3',
    title: '3rd Installment',
    status: 'pending',
    dueDate: 'Apr 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
    canPayNow: true,
  },
  {
    id: '4',
    title: '4th Installment',
    status: 'pending',
    dueDate: 'Apr 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
    canPayNow: true,
  },
  {
    id: '5',
    title: '5th Installment',
    status: 'pending',
    dueDate: 'Apr 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
    canPayNow: true,
  },
  {
    id: '6',
    title: '6th Installment',
    status: 'pending',
    dueDate: 'Apr 15, 2026',
    amount: '$8,333',
    quantity: '30 bags',
    canPayNow: true,
  },
];

const FACTORY_ORDER_STATUS_LABELS = {
  produced: 'Produced',
  'in-production': 'In Production',
  ready: 'Ready',
  assigned: 'Assigned',
  cancel: 'Cancel',
  completed: 'Completed',
};

const FACTORY_ORDER_DRIVER = {
  name: 'John Smith',
  phone: '+1 (555) 123-4567',
  vehicle: 'Truck #TR-4523',
};

/** Full order payload for supplier factory order detail */
export function getSupplierFactoryOrderDetail(orderId, statusOverride) {
  const listOrder = DEMO_SUPPLIER_FACTORY_ORDERS.orders.find(
    (order) => order.id === orderId,
  );
  if (!listOrder) return null;

  const status = statusOverride || listOrder.status;
  const statusLabel =
    FACTORY_ORDER_STATUS_LABELS[status] || listOrder.statusLabel;
  const showTransporter =
    status === 'assigned' || status === 'in-production' || status === 'ready';

  return {
    id: listOrder.id,
    orderId: 'ORD-001',
    orderDate: listOrder.date,
    status,
    statusLabel,
    hasInstallment: true,
    context: 'factory',
    recipientType: 'supplier',
    company: {
      name: 'ABC CORP',
      email: 'abccorp@gmail.com',
      phone: '+123 765 3490',
    },
    logistics: {
      deliveryLocation: '123 Main St, Downtown',
    },
    payment: {
      totalPrice: '$125,500',
      paidAmount: '$25,100',
      remainingBalance: '$100,400',
      paidNote: 'Pay $10,040/month for 10 months',
      duration: '10 months',
    },
    products: FACTORY_ORDER_PRODUCTS,
    installmentBreakdown: FACTORY_ORDER_INSTALLMENT_BREAKDOWN,
    installments: DEMO_FACTORY_ORDER_INSTALLMENTS,
    transporter: showTransporter ? FACTORY_ORDER_DRIVER : null,
    cancelReason: status === 'cancel' ? DEMO_ORDER_CANCEL.cancelReason : null,
  };
}

// ── Supplier fiscal documents ─────────────────────────────────────
export const DEMO_SUPPLIER_FISCAL_DOCUMENTS = {
  stats: {
    totalDocuments: 4,
    thisMonth: 12,
    invoices: 8,
    totalValue: '$8,340',
  },
  documents: [
    {
      id: 'doc-2847',
      documentId: 'DOC-2847',
      type: 'invoice',
      orderId: 'ORD-001',
      customer: 'Downtown Construction Co.',
      amount: '$285.00',
      date: '2024-05-28',
    },
    {
      id: 'doc-2848',
      documentId: 'DOC-2848',
      type: 'invoice',
      orderId: 'ORD-002',
      customer: 'Metro Builders Inc.',
      amount: '$420.50',
      date: '2024-05-27',
    },
    {
      id: 'doc-2849',
      documentId: 'DOC-2849',
      type: 'invoice',
      orderId: 'ORD-003',
      customer: 'Summit Development',
      amount: '$892.00',
      date: '2024-05-26',
    },
    {
      id: 'doc-2850',
      documentId: 'DOC-2850',
      type: 'invoice',
      orderId: 'ORD-004',
      customer: 'Coastal Contractors',
      amount: '$156.75',
      date: '2024-05-25',
    },
    {
      id: 'doc-2851',
      documentId: 'DOC-2851',
      type: 'invoice',
      orderId: 'ORD-005',
      customer: 'Apex Construction',
      amount: '$634.20',
      date: '2024-05-24',
    },
    {
      id: 'doc-2852',
      documentId: 'DOC-2852',
      type: 'invoice',
      orderId: 'ORD-006',
      customer: 'Harbor Building Co.',
      amount: '$298.90',
      date: '2024-05-23',
    },
    {
      id: 'doc-2853',
      documentId: 'DOC-2853',
      type: 'invoice',
      orderId: 'ORD-007',
      customer: 'Valley Homes LLC',
      amount: '$512.55',
      date: '2024-05-22',
    },
  ],
};

export const DEMO_SUPPLIER_FISCAL_DOCUMENT_STAT_CARDS = [
  {
    id: 'totalDocuments',
    labelKey: 'panel.supplierFiscalDocuments.totalDocuments',
    valueKey: 'totalDocuments',
    variant: 'filled',
    tone: 'brand',
  },
  {
    id: 'thisMonth',
    labelKey: 'panel.supplierFiscalDocuments.thisMonth',
    valueKey: 'thisMonth',
    variant: 'badge',
  },
  {
    id: 'invoices',
    labelKey: 'panel.supplierFiscalDocuments.invoices',
    valueKey: 'invoices',
    variant: 'badge',
  },
  {
    id: 'totalValue',
    labelKey: 'panel.supplierFiscalDocuments.totalValue',
    valueKey: 'totalValue',
    variant: 'badge',
  },
];

export const SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE = 7;

/** Completed deliveries available for fiscal document generation */
export const DEMO_SUPPLIER_FISCAL_DOCUMENT_ORDER_OPTIONS = [
  { value: 'ORD-001', label: 'ORD-001' },
  { value: 'ORD-002', label: 'ORD-002' },
  { value: 'ORD-003', label: 'ORD-003' },
  { value: 'ORD-004', label: 'ORD-004' },
  { value: 'ORD-005', label: 'ORD-005' },
  { value: 'ORD-006', label: 'ORD-006' },
  { value: 'ORD-007', label: 'ORD-007' },
];

// ── Supplier buy from factory catalog ───────────────────────────────
const FACTORY_PRODUCT_DESCRIPTION =
  'High-strength building cement suitable for construction and masonry work.';

export const DEMO_SUPPLIER_BUY_FROM_FACTORY_PRODUCTS = [
  {
    id: 'factory-p1',
    factoryId: 'f-cement',
    product: {
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      title: 'Portland Cement Quick Set',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $130 per bag (50 kg)',
    },
  },
  {
    id: 'factory-p2',
    factoryId: 'f-steel',
    product: {
      image:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      title: 'Reinforcing Steel Bar (Rebar)',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $90 per ton',
    },
  },
  {
    id: 'factory-p3',
    factoryId: 'f-blocks',
    product: {
      image:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      title: 'Concrete Blocks',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $2 per piece',
    },
  },
  {
    id: 'factory-p4',
    factoryId: 'f-bricks',
    product: {
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      title: 'Clay Bricks',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $0.50 per piece',
    },
  },
  {
    id: 'factory-p5',
    factoryId: 'f-sand',
    product: {
      image:
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      title: 'Fine Sand',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $40 per ton',
    },
  },
  {
    id: 'factory-p6',
    factoryId: 'f-gravel',
    product: {
      image:
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      title: 'Gravel Aggregate',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $55 per ton',
    },
  },
  {
    id: 'factory-p7',
    factoryId: 'f-stone',
    product: {
      image:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      title: 'Crushed Stone',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $60 per ton',
    },
  },
  {
    id: 'factory-p8',
    factoryId: 'f-plywood',
    product: {
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      title: 'Plywood Sheet',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $25 per sheet',
    },
  },
  {
    id: 'factory-p9',
    factoryId: 'f-cement',
    product: {
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      title: 'Portland Cement Standard',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $115 per bag (50 kg)',
    },
  },
  {
    id: 'factory-p10',
    factoryId: 'f-steel',
    product: {
      image:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      title: 'Steel Mesh Sheet',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $75 per sheet',
    },
  },
  {
    id: 'factory-p11',
    factoryId: 'f-tiles',
    product: {
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      title: 'Roof Tiles',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $3 per piece',
    },
  },
  {
    id: 'factory-p12',
    factoryId: 'f-tiles',
    product: {
      image:
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      title: 'Ceramic Floor Tiles',
      description: FACTORY_PRODUCT_DESCRIPTION,
      priceText: 'Price: $18 per box',
    },
  },
];

export const SUPPLIER_BUY_FROM_FACTORY_PAGE_SIZE = 8;

const FACTORY_PRODUCT_OVERVIEW = [
  { label: 'Product Name', value: 'Portland Cement' },
  { label: 'Brand', value: 'Anycubic' },
  {
    label: 'Specific Uses',
    value:
      'Concrete Work, Masonry, Plastering, Structural Construction, Flooring',
  },
  {
    label: 'Type',
    value: 'Ordinary Portland Cement (OPC) / Portland Composite Cement (PCC)',
  },
  {
    label: 'Grade',
    value: '32.5 / 42.5 / 52.5 Grade (depending on requirement)',
  },
  { label: 'Form', value: 'Fine Powder' },
  { label: 'Color', value: 'Grey' },
  { label: 'Packaging Size', value: '50 KG Bag' },
];

const FACTORY_PRODUCT_TECHNICAL_SPECS = [
  {
    title: 'Compressive Strength',
    lines: ['High early and long-term strength performance'],
  },
  {
    title: 'Setting Time',
    lines: ['Initial: 30–45 minutes', 'Final: Up to 10 hours'],
  },
  {
    title: 'Compatibility',
    lines: [
      'Suitable for all types of aggregates, sand, and construction materials',
    ],
  },
  {
    title: 'Product Warranty',
    lines: ['Quality assured as per industry standards'],
  },
];

function parseFactoryListPrice(priceText) {
  if (!priceText) {
    return { price: '$130.00', unit: 'Bag ( 50kg )' };
  }

  const cleaned = priceText.replace(/^Price:\s*/i, '').trim();
  const match = cleaned.match(/^\$?([\d.]+)\s+per\s+(.+)$/i);
  if (match) {
    return { price: `$${match[1]}`, unit: match[2] };
  }

  return { price: cleaned, unit: null };
}

/** Full PDP payload for supplier buy-from-factory detail (API-ready shape). */
export function getSupplierBuyFromFactoryDetail(productId) {
  const listItem = DEMO_SUPPLIER_BUY_FROM_FACTORY_PRODUCTS.find(
    (item) => item.id === productId,
  );
  if (!listItem) return null;

  const image = listItem.product.image || IMG_MAIN;
  const images = [
    image,
    ...DEMO_PRODUCT.images.filter((src) => src !== image).slice(0, 3),
  ];
  const { price, unit } = parseFactoryListPrice(listItem.product.priceText);

  return {
    ...DEMO_PRODUCT,
    title: listItem.product.title || DEMO_PRODUCT.title,
    sku: DEMO_PRODUCT.sku,
    category: 'Building Materials',
    availability: 'In Stock',
    rating: 4.7,
    feedbackCount: 21671,
    price,
    unit,
    priceText: undefined,
    images,
    image,
    description:
      listItem.product.description || DEMO_PRODUCT.descriptionParagraphs?.[0],
    seller: {
      ...DEMO_PRODUCT.seller,
      name: 'R2A Store',
      rating: 4.6,
      reviewCount: 66,
    },
    overviewItems: FACTORY_PRODUCT_OVERVIEW.map((item) => ({
      ...item,
      value:
        item.label === 'Product Name'
          ? listItem.product.title || item.value
          : item.value,
    })),
    technicalSpecs: FACTORY_PRODUCT_TECHNICAL_SPECS,
    factoryId: listItem.factoryId,
  };
}

// ── Supplier products catalog ─────────────────────────────────────
const SUPPLIER_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';

const SUPPLIER_PRODUCT_TITLES = [
  'Portland Cement',
  'Portland Cement Standard',
  'Portland Cement Quick Set',
];

const SUPPLIER_PRODUCT_DESCRIPTION =
  'High-strength building cement suitable for construction and masonry work.';

const SUPPLIER_FEATURED_BADGE = {
  label: 'Featured',
  className: 'bg-sky-100 text-sky-700',
};

function buildSupplierCatalogProduct(id, config) {
  const titleIndex =
    Number(id.replace(/\D/g, '')) % SUPPLIER_PRODUCT_TITLES.length;

  return {
    id,
    tab: config.tab,
    categoryId: config.categoryId || 'cement-mortar-concrete',
    cardType: config.cardType || 'dashboard',
    tag: config.tag ?? null,
    status: config.status ?? null,
    badge: config.badge ?? null,
    product: {
      image: SUPPLIER_PRODUCT_IMAGE,
      title: config.title || SUPPLIER_PRODUCT_TITLES[titleIndex],
      description: config.description || SUPPLIER_PRODUCT_DESCRIPTION,
      priceText: config.priceText || 'Price: $115 per bag (50 kg)',
      expiryDate: config.expiryDate,
    },
  };
}

function buildSupplierCatalogBatch(tab, count, baseConfig = {}) {
  return Array.from({ length: count }, (_, index) =>
    buildSupplierCatalogProduct(`supplier-${tab}-${index + 1}`, {
      ...baseConfig,
      tab,
    }),
  );
}

export const DEMO_SUPPLIER_PRODUCTS = [
  ...buildSupplierCatalogBatch('pending', 8, { status: 'pending' }),
  ...buildSupplierCatalogBatch('rejected', 8, {
    status: 'rejected',
    title: 'Portland Cement Standard',
    description: 'Reliable cement for all your everyday construction needs.',
  }),
  ...buildSupplierCatalogBatch('regular', 8, { tag: 'regular' }),
  ...buildSupplierCatalogBatch('bulk_order', 8, {
    tag: 'bulk_order',
    priceText: 'Price: $135 per bag (50 kg)',
  }),
  ...buildSupplierCatalogBatch('featured', 8, {
    cardType: 'featured',
    badge: SUPPLIER_FEATURED_BADGE,
    title: 'Portland Cement Quick Set',
    description: 'Fast-setting cement for rapid construction work.',
    priceText: 'Price: $130 per bag (50 kg)',
    expiryDate: '5/4/2026',
  }),
];

export const DEMO_SUPPLIER_PRODUCT_CATEGORIES = [
  { value: 'all', labelKey: 'panel.supplierProducts.allCategories' },
  { value: 'cement-mortar-concrete', label: 'Cement, Mortar & Concrete' },
  { value: 'aggregates', label: 'Aggregates' },
  { value: 'steel-rebar', label: 'Steel & Rebar' },
];

export const SUPPLIER_PRODUCTS_PAGE_SIZE = 8;

/** Full PDP payload for supplier product details (API-ready shape). */
export function getSupplierProductDetail(productId) {
  const catalogItem = DEMO_SUPPLIER_PRODUCTS.find(
    (item) => item.id === productId,
  );
  if (!catalogItem) return null;

  const image = catalogItem.product.image || DEMO_PRODUCT.images[0];
  const images = image
    ? [image, ...DEMO_PRODUCT.images.filter((src) => src !== image).slice(0, 3)]
    : DEMO_PRODUCT.images;

  return {
    ...DEMO_PRODUCT,
    title: catalogItem.product.title || DEMO_PRODUCT.title,
    description:
      catalogItem.product.description ||
      DEMO_PRODUCT.descriptionParagraphs?.[0],
    images,
    image,
    priceText: catalogItem.product.priceText || DEMO_PRODUCT.priceText,
    expiryDate: catalogItem.product.expiryDate,
  };
}

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
};

const DEMO_ADD_PRODUCT_LONG_TEXT =
  'Portland Cement is a high-quality, versatile construction material designed for strong, durable, and long-lasting structures. It is widely used for concrete, mortar, plastering, and other construction applications, ensuring excellent bonding and superior performance. With its fine composition and consistent quality, this cement provides smooth workability and reliable strength development. It is suitable for residential, commercial, and industrial projects, making it an essential material for builders and contractors. Its advanced formulation ensures high compressive strength, resistance to cracks, and long-term durability. Whether used for foundations, walls, or finishing work, Portland Cement delivers dependable results for all types of construction needs.';

export const DEMO_WAREHOUSE_OPTIONS = [
  { value: '', label: 'Select warehouse' },
  { value: 'wh-santa-ana', label: DEMO_PRODUCT.warehouse },
];

export const DEMO_ADD_PRODUCT = {
  ...EMPTY_ADD_PRODUCT,
  categoryId: 'cement-mortar-concrete',
  subCategoryId: 'cements',
  productTypeId: 'ordinary-portland-cement-cem-i',
  title: 'Portland Cement Quick Set',
  quantity: '800 Bags',
  basePrice: '$120.00',
  b2bDiscount: '20%',
  minB2bQuantity: '10 pcs',
  weight: '900 kg',
  description: DEMO_PRODUCT.descriptionParagraphs.join('\n\n'),
  feature: DEMO_PRODUCT.features.map((item) => `• ${item}`).join('\n'),
  additionalInformation: DEMO_ADD_PRODUCT_LONG_TEXT,
  specifications: DEMO_ADD_PRODUCT_LONG_TEXT,
  bulkTiers: [
    { id: 'tier-1', quantity: '1-20', price: '$40.00' },
    { id: 'tier-2', quantity: '20-40', price: '$38.00' },
  ],
};

// ── Supplier promo codes ──────────────────────────────────────────
export const DEMO_SUPPLIER_PROMO_CODES = [
  {
    id: 'promo-1',
    code: 'OLD2025',
    discountType: 'percentage',
    discountValue: '15%',
    minOrder: '$20',
    usageLimit: '100',
    usageLimitUnlimited: false,
    usedCount: 75,
    status: 'active',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-2',
    code: 'holiday2025',
    discountType: 'percentage',
    discountValue: '15%',
    minOrder: '$20',
    usageLimit: '100',
    usageLimitUnlimited: false,
    usedCount: 75,
    status: 'disabled',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-3',
    code: 'SAVEJAN',
    discountType: 'percentage',
    discountValue: '15%',
    minOrder: '$20',
    usageLimit: '100',
    usageLimitUnlimited: false,
    usedCount: 75,
    status: 'disabled',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-4',
    code: 'WELCOME15',
    discountType: 'percentage',
    discountValue: '15%',
    minOrder: '$20',
    usageLimit: '100',
    usageLimitUnlimited: false,
    usedCount: 75,
    status: 'expired',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-5',
    code: 'Ismail',
    discountType: 'fixed',
    discountValue: '$100',
    minOrder: '$0',
    usageLimit: 'Unlimited',
    usageLimitUnlimited: true,
    usedCount: 75,
    status: 'expired',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-6',
    code: '5865839',
    discountType: 'fixed',
    discountValue: '$100',
    minOrder: '$0',
    usageLimit: 'Unlimited',
    usageLimitUnlimited: true,
    usedCount: 75,
    status: 'active',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-7',
    code: 'Winter Is Coming!-2025',
    discountType: 'fixed',
    discountValue: '$100',
    minOrder: '$0',
    usageLimit: 'Unlimited',
    usageLimitUnlimited: true,
    usedCount: 75,
    status: 'active',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-8',
    code: 'BLACKFRIDAY-2025',
    discountType: 'fixed',
    discountValue: '$100',
    minOrder: '$0',
    usageLimit: 'Unlimited',
    usageLimitUnlimited: true,
    usedCount: 75,
    status: 'active',
    expiryDate: 'Dec 31, 2025',
  },
  {
    id: 'promo-9',
    code: 'SUMMER2025',
    discountType: 'percentage',
    discountValue: '15%',
    minOrder: '$20',
    usageLimit: '100',
    usageLimitUnlimited: false,
    usedCount: 75,
    status: 'active',
    expiryDate: 'Dec 31, 2025',
  },
];

const DEMO_QUICK_SET_PRODUCT = DEMO_SUPPLIER_PRODUCTS.find(
  (item) => item.product?.title === 'Portland Cement Quick Set',
);

export const DEMO_SUPPLIER_PROMO_PRODUCT_OPTIONS = Array.from(
  new Map(
    DEMO_SUPPLIER_PRODUCTS.map((item) => [
      item.id,
      {
        value: item.id,
        label: item.product?.title || item.id,
      },
    ]),
  ).values(),
);

export const DEMO_CREATE_PROMO_CODE = {
  code: 'SAVE10',
  discountType: 'percentage',
  discountValue: '10 %',
  minOrderAmount: '$ 50',
  expiryDate: '',
  usageLimit: '100',
  usageUnlimited: false,
  applicableUsers: 'all',
  applicableCategory: 'cement-mortar-concrete',
  applicableProductIds: DEMO_QUICK_SET_PRODUCT
    ? [DEMO_QUICK_SET_PRODUCT.id]
    : [],
};

const PROMO_PRODUCT_TEMPLATES = [
  {
    title: 'Portland Cement Quick Set',
    description: 'Fast-setting cement for rapid construction work.',
    priceText: 'Price: $130 per bag (50 kg)',
  },
  {
    title: 'Reinforcing Steel Bar (Rebar)',
    description: 'High-strength steel for structural reinforcement.',
    priceText: 'Price: $90 per ton',
  },
  {
    title: 'Concrete Blocks',
    description: 'Durable blocks for walls and structures.',
    priceText: 'Price: $2 per piece',
  },
  {
    title: 'Clay Bricks',
    description: 'Traditional bricks for strong construction.',
    priceText: 'Price: $0.50 per piece',
  },
  {
    title: 'Fine Sand',
    description: 'Clean fine sand for plastering and finishing work.',
    priceText: 'Price: $35 per ton',
  },
  {
    title: 'Gravel Aggregate',
    description: 'Crushed gravel for concrete and road base.',
    priceText: 'Price: $40 per ton',
  },
  {
    title: 'Crushed Stone',
    description: 'Hard-wearing aggregate for heavy-duty construction.',
    priceText: 'Price: $45 per ton',
  },
  {
    title: 'Plywood Sheet',
    description: 'Strong plywood sheets for formwork and interiors.',
    priceText: 'Price: $28 per sheet',
  },
  {
    title: 'Granite Stone',
    description: 'Polished granite for flooring and exterior finishes.',
    priceText: 'Price: $80 per square meter',
  },
  {
    title: 'Ceramic Tiles',
    description: 'Durable tiles for walls and floor installations.',
    priceText: 'Price: $12 per piece',
  },
];

function buildPromoProduct(index, template) {
  return {
    id: `promo-product-${index}`,
    product: {
      image: SUPPLIER_PRODUCT_IMAGE,
      title: template.title,
      description: template.description,
      priceText: template.priceText,
      bulkOptionLabel: 'Bulk option Open',
      promoLabel: '25% Off',
    },
  };
}

export const SUPPLIER_PROMO_PRODUCTS_PAGE_SIZE = 12;

export const DEMO_SUPPLIER_PROMO_PRODUCTS = Array.from(
  { length: 40 },
  (_, index) =>
    buildPromoProduct(
      index + 1,
      PROMO_PRODUCT_TEMPLATES[index % PROMO_PRODUCT_TEMPLATES.length],
    ),
);

export const DEMO_FACTORY_PRODUCT = {
  ...EMPTY_ADD_PRODUCT,
  bulkEnabled: false,
  bulkTiers: [],
};

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
};

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
};

/** @deprecated use DEMO_CREATE_AUCTION_*_PLACEHOLDERS */
export const DEMO_CREATE_AUCTION_SUPPLIER =
  DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS;
export const DEMO_CREATE_AUCTION_FACTORY =
  DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS;

// ── Messenger ─────────────────────────────────────────────────────
export const DEMO_MESSENGER_CHATS = [
  {
    id: 'c1',
    name: 'TechPrint Hub',
    lastMessage: 'Offer sent for Portland Cement',
    time: '7:25pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p1', name: 'TechPrint Hub', avatar: null },
  },
  {
    id: 'c2',
    name: 'Ope',
    lastMessage: 'Looking forward to your reply',
    time: '6:21pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p2', name: 'Ope', avatar: null },
  },
  {
    id: 'c3',
    name: '3D Maker Store',
    lastMessage: 'Thanks for the update',
    time: 'Yesterday',
    unreadCount: 0,
    online: false,
    partner: { id: 'p3', name: '3D Maker Store', avatar: null },
  },
  {
    id: 'c4',
    name: 'SteelWorks Inc',
    lastMessage: 'Offer received — Pending Response',
    time: 'Mon',
    unreadCount: 1,
    online: false,
    partner: { id: 'p4', name: 'SteelWorks Inc', avatar: null },
  },
];

export const DEMO_MESSENGER_OFFER = {
  title: 'Offer Card',
  statusLabel: 'Pending Response',
  product: 'Cements',
  quantity: '180 Bags',
  projectName: 'Downtown Office Complex',
  address: '123 Main St, Downtown',
  unloadingType: 'Tipper truck',
  accessConditions: 'Manual Unloading',
  pricing: [
    { label: 'Total Price', value: '$125,500', icon: 'dollar' },
    { label: 'Installment', value: '10 months', icon: 'calendar' },
    { label: '1st Installment', value: '$125,500', icon: 'dollar' },
    { label: 'Quantity', value: '30 Bags' },
    { label: '2nd Installment', value: '$125,500', icon: 'dollar' },
    { label: 'Quantity', value: '30 Bags' },
  ],
  summary: {
    firstInstallment: '$25,100',
    remainingBalance: '$100,400',
    note: 'Pay $10,040/month for 10 months',
  },
};

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
      text: 'Hey, are you available for a quick quote on bulk cement?',
      time: '6:05 PM',
      partner: { id: 'p2', name: 'Ope' },
    },
    {
      id: 'm11',
      sender: 'me',
      text: 'Yes — here is a detailed offer for your project.',
      time: '6:12 PM',
      status: 'Read',
    },
    {
      id: 'm12',
      sender: 'me',
      type: 'offer',
      time: '6:21 PM',
      status: 'Delivered',
      offer: {
        ...DEMO_MESSENGER_OFFER,
        statusLabel: 'Awaiting their response',
      },
    },
  ],
  /** Buyer view: partner sent the offer → Pay Now / Negotiate */
  c4: [
    {
      id: 'm20',
      sender: 'them',
      text: 'Here is our offer for the steel order.',
      time: '5:10 PM',
      partner: { id: 'p4', name: 'SteelWorks Inc' },
    },
    {
      id: 'm21',
      sender: 'them',
      type: 'offer',
      time: '5:12 PM',
      partner: { id: 'p4', name: 'SteelWorks Inc' },
      offer: {
        ...DEMO_MESSENGER_OFFER,
        statusLabel: 'Pending Response',
      },
    },
  ],
};

/** Supplier panel chat — inbox list and default conversation (Ope) */
export const DEMO_SUPPLIER_MESSENGER_CHATS = [
  {
    id: 'c-tech',
    name: 'TechPrint Hub',
    lastMessage: 'Can you send the updated quote?',
    time: '4:32pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p-tech', name: 'TechPrint Hub', avatar: null },
  },
  {
    id: 'c-ope',
    name: 'Ope',
    lastMessage: 'Cho dey house?',
    time: '6:21pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p-ope', name: 'Ope', avatar: null },
  },
  {
    id: 'c-maker',
    name: '3D Maker Store',
    lastMessage: 'Thanks for the update',
    time: '7:25pm',
    unreadCount: 0,
    online: false,
    partner: { id: 'p-maker', name: '3D Maker Store', avatar: null },
  },
  {
    id: 'c-printify',
    name: 'Printify Zone',
    lastMessage: 'We need 200 bags delivered',
    time: '4:31pm',
    unreadCount: 0,
    online: false,
    partner: { id: 'p-printify', name: 'Printify Zone', avatar: null },
  },
  {
    id: 'c-invent',
    name: 'Invent3D',
    lastMessage: 'Is the offer still available?',
    time: '8:35pm',
    unreadCount: 0,
    online: false,
    partner: { id: 'p-invent', name: 'Invent3D', avatar: null },
  },
  {
    id: 'c-hub',
    name: '3D Hub',
    lastMessage: 'Please confirm delivery date',
    time: '9:12pm',
    unreadCount: 0,
    online: false,
    partner: { id: 'p-hub', name: '3D Hub', avatar: null },
  },
  {
    id: 'c-form',
    name: 'Form3DShop',
    lastMessage: 'Looking forward to your reply',
    time: '10:14pm',
    unreadCount: 0,
    online: false,
    partner: { id: 'p-form', name: 'Form3DShop', avatar: null },
  },
];

export const DEMO_SUPPLIER_MESSENGER_MESSAGES = {
  'c-ope': [
    {
      id: 'so-m1',
      sender: 'them',
      text: 'Yo mandem',
      time: '6:18 PM',
      partner: { id: 'p-ope', name: 'Ope' },
    },
    {
      id: 'so-m2',
      sender: 'them',
      text: 'Cho dey house?',
      time: '6:19 PM',
      partner: { id: 'p-ope', name: 'Ope' },
    },
    {
      id: 'so-m3',
      sender: 'me',
      text: 'Kwasia 😂 😂',
      time: '6:20 PM',
      status: 'Read',
    },
    {
      id: 'so-m4',
      sender: 'me',
      text: 'You dey hung dier you kai say house dey',
      time: '6:21 PM',
      status: 'Read',
    },
    {
      id: 'so-m5',
      sender: 'me',
      type: 'offer',
      time: '6:21 PM',
      status: 'Delivered',
      offer: {
        ...DEMO_MESSENGER_OFFER,
        statusLabel: 'Pending Response',
      },
    },
  ],
  'c-tech': [
    {
      id: 'st-m1',
      sender: 'them',
      text: 'Hi — we need cement for the riverside project.',
      time: '4:05 PM',
      partner: { id: 'p-tech', name: 'TechPrint Hub' },
    },
    {
      id: 'st-m2',
      sender: 'me',
      text: 'Sure. I can prepare an offer with installment options.',
      time: '4:12 PM',
      status: 'Read',
    },
  ],
};

// ── Dispute resolution ─────────────────────────────────────────────
const DISPUTE_IMG_MARBLE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=80';
const DISPUTE_IMG_GRANITE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80';
const DISPUTE_EVIDENCE_1 =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80';
const DISPUTE_EVIDENCE_2 =
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80';

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
];

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
};

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
};

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
];

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
};

export const DEMO_PANEL_PROFILE_SUPPLIER = { ...DEMO_PANEL_PROFILE };
export const DEMO_PANEL_PROFILE_FACTORY = {
  ...DEMO_PANEL_PROFILE,
  displayName: 'UltraMix Concrete Plant',
  displayEmail: 'factory@demo.com',
  name: 'UltraMix Factory',
  email: 'factory@demo.com',
};
export const DEMO_PANEL_PROFILE_TRANSPORTER = {
  ...DEMO_PANEL_PROFILE,
  displayName: 'Swift Logistics',
  displayEmail: 'transporter@demo.com',
  name: 'Swift Logistics',
  email: 'transporter@demo.com',
  phone: '+1 (555) 220-3344',
  warehouses: [],
};
export const DEMO_PANEL_PROFILE_ADMIN = {
  ...DEMO_PANEL_PROFILE,
  displayName: 'Platform Admin',
  displayEmail: 'admin@demo.com',
  name: 'Platform Admin',
  email: 'admin@demo.com',
  warehouses: [],
};
export const DEMO_PANEL_PROFILE_AFFILIATE = {
  ...DEMO_PANEL_PROFILE,
  displayName: 'Affiliate Partner',
  displayEmail: 'affiliate@demo.com',
  name: 'Affiliate Partner',
  email: 'affiliate@demo.com',
  phone: '+1 (555) 440-5566',
  warehouses: [],
};
