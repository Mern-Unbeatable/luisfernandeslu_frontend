export const ADMIN_TRANSPORTER_STATS = {
  totalTransporters: '342',
  active: '298',
  underReview: '23',
  suspended: '21',
}

export const ADMIN_TRANSPORTER_TABS = [
  { id: 'all', labelKey: 'adminTransporterManagement.tabs.all' },
  { id: 'pending', labelKey: 'adminTransporterManagement.tabs.pending' },
  { id: 'suspended', labelKey: 'adminTransporterManagement.tabs.suspended' },
]

const DOCUMENT_PLACEHOLDERS = [
  { id: 'doc-1', tone: 'blue' },
  { id: 'doc-2', tone: 'amber' },
  { id: 'doc-3', tone: 'blue' },
  { id: 'doc-4', tone: 'neutral' },
  { id: 'doc-5', tone: 'neutral' },
]

export const ADMIN_TRANSPORTERS = [
  {
    id: 't-1',
    name: 'John Anderson',
    email: 'john.anderson@company.com',
    phone: '+0123 456 789',
    registered: '2026-06-09',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+0123 456 790',
    registered: '2026-05-28',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-3',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+0123 456 791',
    registered: '2026-04-15',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-4',
    name: 'Ralph Edwards',
    email: 'ralph.edwards@email.com',
    phone: '+0123 456 797',
    registered: '2026-07-01',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-5',
    name: 'Brooklyn Simmons',
    email: 'brooklyn.simmons@email.com',
    phone: '+0123 456 798',
    registered: '2026-06-18',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    phone: '+0123 456 794',
    registered: '2026-01-05',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-7',
    name: 'James Taylor',
    email: 'james.taylor@email.com',
    phone: '+0123 456 795',
    registered: '2025-12-18',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-8',
    name: 'BuildPro Corp',
    email: 'admin@buildpro.com',
    phone: '+351 912 345 678',
    registered: '2025-11-02',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS.slice(0, 2),
  },
  {
    id: 't-9',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+0123 456 792',
    registered: '2026-02-20',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 't-10',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+0123 456 793',
    registered: '2026-01-10',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
]

export function filterTransportersByTab(rows, tabId) {
  if (tabId === 'pending') {
    return rows.filter((row) => row.status.toLowerCase() === 'pending')
  }
  if (tabId === 'suspended') {
    return rows.filter((row) => row.status.toLowerCase() === 'suspended')
  }
  return rows
}

export function filterTransportersBySearch(rows, query) {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => {
    const haystack = [row.name, row.email, row.phone, row.status, row.registered]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function formatTransporterRegisteredDate(isoDate) {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${m}/${d}/${y}`
}
