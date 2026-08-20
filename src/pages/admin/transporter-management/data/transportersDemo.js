export const ADMIN_TRANSPORTER_TABS = [
  { id: 'all', labelKey: 'adminTransporterManagement.tabs.all' },
  { id: 'pending', labelKey: 'adminTransporterManagement.tabs.pending' },
  { id: 'suspended', labelKey: 'adminTransporterManagement.tabs.suspended' },
]

export function formatTransporterRegisteredDate(isoDate) {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${m}/${d}/${y}`
}
