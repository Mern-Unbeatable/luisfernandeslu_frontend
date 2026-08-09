/**
 * Public storefront buyer UI: guest + customer → retail; logged-in company → company pricing/actions.
 * Auth role id is `customer` (not "user").
 */
export function resolveStorefrontBuyerRole(user) {
  if (user?.role === 'company') return 'company'
  return 'customer'
}
