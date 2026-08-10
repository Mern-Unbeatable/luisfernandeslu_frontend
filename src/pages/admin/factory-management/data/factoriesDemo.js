export const ADMIN_FACTORY_STATS = {
  totalFactories: '342',
  active: '298',
  underReview: '23',
  suspended: '21',
}

export const ADMIN_FACTORY_TABS = [
  { id: 'all', labelKey: 'adminFactoryManagement.tabs.all' },
  { id: 'pending', labelKey: 'adminFactoryManagement.tabs.pending' },
  { id: 'suspended', labelKey: 'adminFactoryManagement.tabs.suspended' },
]

const DOCUMENT_PLACEHOLDERS = [
  { id: 'doc-1', tone: 'blue' },
  { id: 'doc-2', tone: 'amber' },
  { id: 'doc-3', tone: 'blue' },
  { id: 'doc-4', tone: 'neutral' },
  { id: 'doc-5', tone: 'neutral' },
]

export const ADMIN_FACTORIES = [
  {
    id: 'f-1',
    name: 'John Anderson',
    email: 'john.anderson@company.com',
    phone: '+0123 456 789',
    registered: '2026-06-09',
    commission: '20%',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+0123 456 790',
    registered: '2026-05-28',
    commission: '20%',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-3',
    name: 'BuildPro Corp',
    email: 'contact@buildpro.pt',
    phone: '+0123 456 796',
    registered: '2026-04-15',
    commission: '40%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-4',
    name: 'Ralph Edwards',
    email: 'ralph.edwards@email.com',
    phone: '+0123 456 797',
    registered: '2026-07-01',
    commission: '00%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-5',
    name: 'Brooklyn Simmons',
    email: 'brooklyn.simmons@email.com',
    phone: '+0123 456 798',
    registered: '2026-06-18',
    commission: '00%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    phone: '+0123 456 794',
    registered: '2026-01-05',
    commission: '20%',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-7',
    name: 'James Taylor',
    email: 'james.taylor@email.com',
    phone: '+0123 456 795',
    registered: '2025-12-18',
    commission: '20%',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-8',
    name: 'Atlantic Foods Factory',
    email: 'contact@atlanticfoods.com',
    phone: '+351 912 345 678',
    registered: '2025-11-02',
    commission: '60%',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-9',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+0123 456 791',
    registered: '2026-03-15',
    commission: '20%',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 'f-10',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+0123 456 792',
    registered: '2026-02-20',
    commission: '00%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
]

export function filterFactoriesByTab(rows, tabId) {
  if (tabId === 'pending') {
    return rows.filter((row) => row.status.toLowerCase() === 'pending')
  }
  if (tabId === 'suspended') {
    return rows.filter((row) => row.status.toLowerCase() === 'suspended')
  }
  return rows
}

export function filterFactoriesBySearch(rows, query) {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => {
    const haystack = [
      row.name,
      row.email,
      row.phone,
      row.status,
      row.commission,
      row.registered,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function formatFactoryRegisteredDate(isoDate) {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${m}/${d}/${y}`
}
