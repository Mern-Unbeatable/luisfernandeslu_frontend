import customerRole from './customer'
import companyRole from './company'
import supplierRole from './supplier'
import factoryRole from './factory'
import transporterRole from './transporter'
import affiliateRole from './affiliate'
import adminRole from './admin'

const BUYER_ROLES = {
  customer: customerRole,
  company: companyRole,
}

const PANEL_ROLES = {
  supplier: supplierRole,
  factory: factoryRole,
  transporter: transporterRole,
  affiliate: affiliateRole,
  admin: adminRole,
}

export const PANEL_ROLE_IDS = Object.keys(PANEL_ROLES)

/** Resolve buyer role config. Defaults to company. */
export function getBuyerRoleConfig(role = 'company') {
  return BUYER_ROLES[role] || BUYER_ROLES.company
}

/** Resolve panel role config. Defaults to supplier. */
export function getPanelRoleConfig(role = 'supplier') {
  return PANEL_ROLES[role] || PANEL_ROLES.supplier
}

/** Unique panel routes across all roles (for router). */
export function getAllPanelNavItems() {
  const byPath = new Map()

  for (const role of Object.values(PANEL_ROLES)) {
    for (const item of role.nav) {
      if (!byPath.has(item.to)) {
        byPath.set(item.to, item)
      }
    }
  }

  return [...byPath.values()]
}

export {
  customerRole,
  companyRole,
  supplierRole,
  factoryRole,
  transporterRole,
  affiliateRole,
  adminRole,
}
