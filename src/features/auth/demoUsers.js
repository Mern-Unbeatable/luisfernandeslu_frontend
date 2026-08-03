/** Demo accounts for local UI testing (no backend). Password is the same for all. */
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

export function findDemoUser(email, password) {
  const normalized = String(email || '')
    .trim()
    .toLowerCase()
  return (
    DEMO_USERS.find(
      (user) =>
        user.email === normalized && user.password === password,
    ) || null
  )
}

export function getHomePathForRole(role) {
  if (BUYER_ROLES.has(role)) return '/account'
  return '/panel'
}

export function isBuyerRole(role) {
  return BUYER_ROLES.has(role)
}

export function isPanelRole(role) {
  return !BUYER_ROLES.has(role)
}
