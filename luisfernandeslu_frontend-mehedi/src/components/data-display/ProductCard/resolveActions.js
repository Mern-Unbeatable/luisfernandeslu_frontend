/**
 * @returns {{ id: string, kind: 'icon'|'pill'|'full', label?: string, variant?: string, icon?: string }[]}
 */
export function resolveActions({
  type,
  role = 'none',
  context = 'listing',
  status = null,
  actions,
}) {
  if (Array.isArray(actions)) return actions

  // Promo code product card — discount badge + Edit / Delete
  if (context === 'promo_code') {
    return [
      { id: 'edit', kind: 'pill', label: 'Edit', variant: 'primary' },
      { id: 'delete', kind: 'pill', label: 'Delete', variant: 'danger' },
    ]
  }

  // Admin – product approval queue
  if (role === 'admin' && context === 'approval') {
    if (status === 'pending') {
      return [
        { id: 'accept', kind: 'pill', label: 'Accept', variant: 'primary', icon: 'check' },
        { id: 'reject', kind: 'pill', label: 'Reject', variant: 'danger', icon: 'x' },
        { id: 'details', kind: 'pill', label: 'Details', variant: 'neutral' },
      ]
    }
    if (status === 'active') {
      return [
        { id: 'delete', kind: 'pill', label: 'Delete', variant: 'danger' },
        { id: 'details', kind: 'pill', label: 'Details', variant: 'neutral' },
      ]
    }
    if (status === 'rejected') {
      return [{ id: 'delete', kind: 'pill', label: 'Delete', variant: 'danger' }]
    }
    return []
  }

  // Admin – promotion products
  if (role === 'admin' && context === 'promotion') {
    if (status === 'pending') {
      return [
        { id: 'accept', kind: 'pill', label: 'Accept', variant: 'primary', icon: 'check' },
        { id: 'reject', kind: 'pill', label: 'Reject', variant: 'danger', icon: 'x' },
        { id: 'details', kind: 'pill', label: 'Details', variant: 'neutral' },
      ]
    }
    if (status === 'active') {
      return [{ id: 'deactivate', kind: 'full', label: 'Deactivate', variant: 'primary' }]
    }
    // Accepted as featured — countdown badge only (no footer CTA in design)
    if (status === 'featured') {
      return []
    }
    if (status === 'completed') {
      return [{ id: 'delete', kind: 'full', label: 'Delete', variant: 'danger' }]
    }
    return []
  }

  // Supplier dashboard
  if (role === 'supplier' && type === 'dashboard') {
    if (status === 'pending') {
      return [{ id: 'cancel', kind: 'full', label: 'Cancel', variant: 'primary' }]
    }
    if (status === 'rejected') {
      return [
        { id: 'edit', kind: 'icon', icon: 'edit' },
        { id: 'delete', kind: 'icon', icon: 'delete' },
        { id: 'resubmit', kind: 'pill', label: 'Resubmit', variant: 'primary' },
      ]
    }
    // active / all / tagged listings
    return [
      { id: 'edit', kind: 'icon', icon: 'edit' },
      { id: 'delete', kind: 'icon', icon: 'delete' },
      { id: 'promote', kind: 'pill', label: 'Promote', variant: 'primary' },
    ]
  }

  // Factory dashboard
  if (role === 'factory' && type === 'dashboard') {
    if (status === 'pending') {
      return [{ id: 'delete', kind: 'full', label: 'Delete', variant: 'danger' }]
    }
    if (status === 'rejected') {
      return [
        { id: 'edit', kind: 'pill', label: 'Edit', variant: 'primary' },
        { id: 'resubmit', kind: 'pill', label: 'Resubmit', variant: 'primary' },
      ]
    }
    // active
    return [
      { id: 'edit', kind: 'pill', label: 'Edit', variant: 'primary' },
      { id: 'delete', kind: 'pill', label: 'Delete', variant: 'danger' },
    ]
  }

  // Supplier – buy from factory
  if (role === 'supplier' && type === 'normal') {
    return [
      { id: 'send_message', kind: 'full', label: 'Send Message', variant: 'primary', icon: 'message' },
    ]
  }

  // Catalog / customer / company / none
  if (type === 'normal' || type === 'marketing') {
    return [
      { id: 'view_details', kind: 'full', label: 'View Details', variant: 'primary' },
    ]
  }

  // Featured / sponsored marketplace: no action row (sponsored has meta footer)
  return []
}
