export const ADMIN_FACTORY_TABS = [
  { id: 'all', labelKey: 'adminFactoryManagement.tabs.all' },
  { id: 'pending', labelKey: 'adminFactoryManagement.tabs.pending' },
  { id: 'suspended', labelKey: 'adminFactoryManagement.tabs.suspended' },
]

export function formatFactoryRegisteredDate(isoDate) {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${m}/${d}/${y}`
}
