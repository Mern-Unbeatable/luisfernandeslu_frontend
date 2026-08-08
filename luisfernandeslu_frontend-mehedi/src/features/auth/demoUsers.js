/** Demo login helpers. Account payloads live in `src/data/demoData.js`. */
export { DEMO_PASSWORD, DEMO_USERS } from '@/data/demoData'
import { DEMO_USERS } from '@/data/demoData'

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

const BUYER_ROLES = new Set(['customer', 'company'])

/** Role home: /customer, /company, /admin, /supplier, ... */
export function getHomePathForRole(role) {
  if (!role) return '/login'
  return `/${role}`
}

export function isBuyerRole(role) {
  return BUYER_ROLES.has(role)
}

export function isPanelRole(role) {
  return Boolean(role) && !BUYER_ROLES.has(role)
}
