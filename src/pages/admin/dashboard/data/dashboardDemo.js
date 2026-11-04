import {
  FiAlertCircle,
  FiBriefcase,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiTruck,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi'
import { FaIndustry } from 'react-icons/fa'
export const ADMIN_DASHBOARD_CHANNELS = ['all', 'b2b', 'b2c']

export const ADMIN_DASHBOARD_METRICS = [
  {
    id: 'totalGmv',
    value: '€0',
    icon: FiDollarSign,
    iconTone: 'brand',
  },
  {
    id: 'b2bGmv',
    value: '€0',
    icon: FiBriefcase,
    iconTone: 'teal',
  },
  {
    id: 'b2cGmv',
    value: '€0',
    icon: FiShoppingCart,
    iconTone: 'warning',
  },
  {
    id: 'totalRevenue',
    value: '€0',
    icon: FiTrendingUp,
    iconTone: 'purple',
  },
  {
    id: 'commission',
    value: '€0',
    icon: FiDollarSign,
    iconTone: 'red',
  },
  {
    id: 'avgOrderValue',
    value: '€0',
    icon: FiShoppingCart,
    iconTone: 'brand',
  },
  {
    id: 'activeUsers',
    value: '0',
    icon: FiUsers,
    iconTone: 'brand',
  },
  {
    id: 'newRegistrations',
    value: '0',
    icon: FiUserPlus,
    iconTone: 'teal',
  },
  {
    id: 'activeSuppliers',
    value: '0',
    icon: FiBriefcase,
    iconTone: 'warning',
  },
  {
    id: 'activeFactories',
    value: '0',
    icon: FaIndustry,
    iconTone: 'purple',
  },
  {
    id: 'activeTransporters',
    value: '0',
    icon: FiTruck,
    iconTone: 'red',
  },
  {
    id: 'openDisputes',
    value: '0',
    icon: FiAlertCircle,
    iconTone: 'red',
  },
]

export const ADMIN_DASHBOARD_QUICK_ACTIONS = [
  {
    id: 'transporterPayments',
    themeKey: 'orange',
    to: '/admin/finance-payments',
  },
  {
    id: 'affiliatePayouts',
    themeKey: 'purple',
    to: '/admin/finance-payments',
  },
  {
    id: 'affiliateAnalytics',
    themeKey: 'green',
    to: '/admin/affiliate-directory',
  },
]

export const ADMIN_REVENUE_CHART_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const ADMIN_REVENUE_B2B = [
  42000, 48000, 51000, 47000, 55000, 62000, 68000, 64000, 72000, 69000, 58000, 61000,
]

export const ADMIN_REVENUE_B2C = [
  18000, 22000, 24000, 21000, 26000, 31000, 34000, 32000, 38000, 35000, 29000, 30000,
]

export const ADMIN_ORDER_B2B = [420, 380, 450, 410, 480, 520, 560, 530, 590, 550, 470, 500]
export const ADMIN_ORDER_B2C = [280, 260, 310, 290, 340, 370, 390, 360, 410, 380, 320, 340]

export const ADMIN_PERFORMANCE = {
  retention: { b2b: 0, b2c: 0 },
  ltv: { b2b: '€0', b2c: '€0' },
  repurchase: { b2b: 0, b2c: 0 },
}

const METRICS_BY_ID = Object.fromEntries(
  ADMIN_DASHBOARD_METRICS.map((metric) => [metric.id, metric]),
)

/** KPI sets per channel tab (matches B2B / B2C dashboard mocks). */
const CHANNEL_METRIC_IDS = {
  all: ADMIN_DASHBOARD_METRICS.map((m) => m.id),
  b2b: [
    'totalGmv',
    'b2bGmv',
    'totalRevenue',
    'openDisputes',
    'commission',
    'avgOrderValue',
    'activeUsers',
    'newRegistrations',
  ],
  b2c: [
    'totalGmv',
    'b2cGmv',
    'totalRevenue',
    'openDisputes',
    'commission',
    'avgOrderValue',
    'activeUsers',
    'newRegistrations',
  ],
}

export function getAdminMetricsForChannel(channel = 'all') {
  const ids = CHANNEL_METRIC_IDS[channel] || CHANNEL_METRIC_IDS.all
  return ids.map((id) => METRICS_BY_ID[id]).filter(Boolean)
}
