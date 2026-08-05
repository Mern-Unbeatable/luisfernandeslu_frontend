import customerRole from './customer'
import companyRole from './company'
import supplierRole from './supplier'
import factoryRole from './factory'
import transporterRole from './transporter'
import affiliateRole from './affiliate'
import adminRole from './admin'

/**
 * Role configs for sidebar / layout only.
 * All URL routes are declared explicitly in `src/app/router/index.jsx`.
 */

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
export const BUYER_ROLE_IDS = Object.keys(BUYER_ROLES)

/** Resolve buyer role config. Defaults to company. */
export function getBuyerRoleConfig(role = 'company') {
  return BUYER_ROLES[role] || BUYER_ROLES.company
}

/** Resolve panel role config. Defaults to supplier. */
export function getPanelRoleConfig(role = 'supplier') {
  return PANEL_ROLES[role] || PANEL_ROLES.supplier
}

/** Base path for a role: /admin, /supplier, /customer, ... */
export function getRoleBasePath(role) {
  if (!role) return '/'
  return `/${role}`
}

export {
  customerRole,
  companyRole,
  supplierRole,
  factoryRole,
  transporterRole,
  affiliateRole,
  adminRole,
  BUYER_ROLES,
  PANEL_ROLES,
}
