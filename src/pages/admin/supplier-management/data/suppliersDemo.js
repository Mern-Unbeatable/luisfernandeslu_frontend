export const ADMIN_SUPPLIER_TABS = [
  { id: 'all', labelKey: 'adminSupplierManagement.tabs.all' },
  { id: 'pending', labelKey: 'adminSupplierManagement.tabs.pending' },
  { id: 'suspended', labelKey: 'adminSupplierManagement.tabs.suspended' },
]

export function formatSupplierRegisteredDate(isoDate) {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${m}/${d}/${y}`
}
