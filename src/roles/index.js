import customerRole from './customer'
import companyRole from './company'

const BUYER_ROLES = {
  customer: customerRole,
  company: companyRole,
}

/** Resolve buyer role config. Defaults to company. */
export function getBuyerRoleConfig(role = 'company') {
  return BUYER_ROLES[role] || BUYER_ROLES.company
}

export { customerRole, companyRole }
