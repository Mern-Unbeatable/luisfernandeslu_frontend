import {
  FiAlertCircle,
  FiBriefcase,
  FiDollarSign,
  FiHome,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi'

/** Demo payloads matching design images for StatusCard docs. */
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
