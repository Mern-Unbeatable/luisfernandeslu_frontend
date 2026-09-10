import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiTruck,
  FiPackage,
  FiMessageSquare,
  FiShoppingBag,
  FiTag,
  FiDollarSign,
  FiAlertCircle,
  FiShoppingCart,
  FiSettings,
  FiUser,
  FiShield,
} from 'react-icons/fi'
import { FaIndustry, FaGavel } from 'react-icons/fa'

/**
 * Shared staff nav definitions.
 * `permission` maps to backend EDIT_MODULES id.
 * `adminOnly` — full admin only (not shown under /moderator).
 * `always` — always visible when permitted in that area.
 */
export const STAFF_NAV_ITEMS = [
  {
    path: '',
    labelKey: 'panel.nav.dashboard',
    Icon: FiHome,
    end: true,
    permission: 'dashboard-overview',
  },
  {
    path: 'user-management',
    labelKey: 'panel.nav.userManagement',
    Icon: FiUsers,
    permission: 'user-management',
  },
  {
    path: 'supplier-management',
    labelKey: 'panel.nav.supplierManagement',
    Icon: FiBriefcase,
    permission: 'supplier-management',
  },
  {
    path: 'factory-management',
    labelKey: 'panel.nav.factoryManagement',
    Icon: FaIndustry,
    permission: 'factory-management',
  },
  {
    path: 'transporter-management',
    labelKey: 'panel.nav.transporterManagement',
    Icon: FiTruck,
    permission: 'transporter-management',
  },
  {
    path: 'product-moderation',
    labelKey: 'panel.nav.productModeration',
    Icon: FiPackage,
    permission: 'product-moderation',
  },
  {
    path: 'chat',
    labelKey: 'panel.nav.chat',
    Icon: FiMessageSquare,
    permission: 'chat',
  },
  {
    path: 'marketing-management',
    labelKey: 'panel.nav.marketingManagement',
    Icon: FiShoppingBag,
    permission: 'marketing-management',
  },
  {
    path: 'promotion-plans',
    labelKey: 'panel.nav.promotionPlans',
    Icon: FiTag,
    permission: 'promotion-plans',
  },
  {
    path: 'finance-payments',
    labelKey: 'panel.nav.financePayments',
    Icon: FiDollarSign,
    permission: 'finance-payments',
  },
  {
    path: 'disputes',
    labelKey: 'panel.nav.disputesResolution',
    Icon: FiAlertCircle,
    permission: 'disputes',
  },
  {
    path: 'auction',
    labelKey: 'panel.nav.auction',
    Icon: FaGavel,
    permission: 'auction',
  },
  {
    path: 'orders',
    labelKey: 'panel.nav.orders',
    Icon: FiShoppingCart,
    permission: 'orders',
  },
  {
    path: 'delivery-logistics',
    labelKey: 'panel.nav.deliveryLogisticsAdmin',
    Icon: FiTruck,
    permission: 'delivery-logistics',
  },
  {
    path: 'affiliate-directory',
    labelKey: 'panel.nav.affiliateDirectory',
    Icon: FiUsers,
    permission: 'affiliate-directory',
  },
  {
    path: 'roles-permissions',
    labelKey: 'panel.nav.rolesPermissions',
    Icon: FiShield,
    adminOnly: true,
  },
  {
    path: 'settings',
    labelKey: 'panel.nav.settings',
    Icon: FiSettings,
    permission: 'settings',
  },
  {
    path: 'profile',
    labelKey: 'panel.nav.profile',
    Icon: FiUser,
    always: true,
  },
]

export function buildStaffNav(basePath = '/admin', { includeAdminOnly = true } = {}) {
  const root = String(basePath || '/admin').replace(/\/$/, '') || '/admin'
  return STAFF_NAV_ITEMS.filter((item) => includeAdminOnly || !item.adminOnly).map(
    (item) => ({
      ...item,
      to: item.path ? `${root}/${item.path}` : root,
    }),
  )
}

export function filterStaffNav(nav = [], user, { moderatorOnly = false } = {}) {
  if (moderatorOnly || user?.staffRole === 'moderator') {
    const permissions = new Set(user?.permissions || [])
    return nav.filter((item) => {
      if (item.always) return true
      if (item.adminOnly) return false
      if (!item.permission) return false
      return permissions.has(item.permission)
    })
  }
  return nav
}

export function getStaffHomePath(nav = [], fallback = '/admin/profile') {
  return nav[0]?.to || fallback
}

export function isStaffPathAllowed(pathname, nav = []) {
  const path = String(pathname || '').replace(/\/$/, '') || '/'
  return nav.some((item) => {
    if (item.end) return path === item.to
    return path === item.to || path.startsWith(`${item.to}/`)
  })
}

/** Map /admin/... ↔ /moderator/... */
export function swapStaffBasePath(pathname, fromBase, toBase) {
  const path = String(pathname || '')
  const from = String(fromBase || '').replace(/\/$/, '')
  const to = String(toBase || '').replace(/\/$/, '')
  if (path === from || path === `${from}/`) return to
  if (path.startsWith(`${from}/`)) return `${to}${path.slice(from.length)}`
  return to
}

export function getPostLoginStaffPath(user) {
  if (user?.staffRole === 'moderator') return '/moderator'
  return '/admin'
}
