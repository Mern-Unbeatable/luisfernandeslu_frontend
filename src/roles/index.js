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

/**
 * Build RR child routes from a role nav config.
 * Index = basePath; other items = relative segment after basePath.
 */
export function buildNavChildren(roleConfig, renderPage) {
  const base = roleConfig.basePath || getRoleBasePath(roleConfig.id)

  return roleConfig.nav.map((item) => {
    const isIndex = item.end || item.to === base
    const relative = isIndex
      ? undefined
      : item.to.replace(new RegExp(`^${base}/?`), '')

    return {
      ...(isIndex ? { index: true } : { path: relative }),
      ...renderPage(item),
    }
  })
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
