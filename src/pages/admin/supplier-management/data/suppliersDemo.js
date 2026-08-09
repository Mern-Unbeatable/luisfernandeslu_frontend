export const ADMIN_SUPPLIER_STATS = {
  totalSuppliers: '342',
  active: '298',
  underReview: '23',
  suspended: '21',
}

export const ADMIN_SUPPLIER_TABS = [
  { id: 'all', labelKey: 'adminSupplierManagement.tabs.all' },
  { id: 'pending', labelKey: 'adminSupplierManagement.tabs.pending' },
  { id: 'suspended', labelKey: 'adminSupplierManagement.tabs.suspended' },
]

const DOCUMENT_PLACEHOLDERS = [
  { id: 'doc-1', tone: 'blue' },
  { id: 'doc-2', tone: 'amber' },
  { id: 'doc-3', tone: 'blue' },
  { id: 'doc-4', tone: 'neutral' },
  { id: 'doc-5', tone: 'neutral' },
]

export const ADMIN_SUPPLIERS = [
  {
    id: 's-1',
    name: 'John Anderson',
    email: 'john.anderson@company.com',
    phone: '+0123 456 789',
    registered: '2026-06-09',
    commission: '20%',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+0123 456 790',
    registered: '2026-05-28',
    commission: '20%',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-3',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+0123 456 791',
    registered: '2026-04-15',
    commission: '40%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-4',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+0123 456 792',
    registered: '2026-03-20',
    commission: '00%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-5',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+0123 456 793',
    registered: '2026-02-10',
    commission: '00%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    phone: '+0123 456 794',
    registered: '2026-01-05',
    commission: '20%',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-7',
    name: 'James Taylor',
    email: 'james.taylor@email.com',
    phone: '+0123 456 795',
    registered: '2025-12-18',
    commission: '20%',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-8',
    name: 'Raven Trading Ltd.',
    email: 'info@raventrading.com',
    phone: '+351 912 345 678',
    registered: '2025-11-02',
    commission: '60%',
    status: 'Suspended',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-9',
    name: 'BuildPro Corp',
    email: 'contact@buildpro.pt',
    phone: '+0123 456 796',
    registered: '2025-10-14',
    commission: '20%',
    status: 'Active',
    documents: DOCUMENT_PLACEHOLDERS,
  },
  {
    id: 's-10',
    name: 'Ralph Edwards',
    email: 'ralph.edwards@email.com',
    phone: '+0123 456 797',
    registered: '2026-07-01',
    commission: '00%',
    status: 'Pending',
    documents: DOCUMENT_PLACEHOLDERS,
  },
]

export function filterSuppliersByTab(rows, tabId) {
  if (tabId === 'pending') {
    return rows.filter((row) => row.status.toLowerCase() === 'pending')
  }
  if (tabId === 'suspended') {
    return rows.filter((row) => row.status.toLowerCase() === 'suspended')
  }
  return rows
}

export function filterSuppliersBySearch(rows, query) {
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

export function formatSupplierRegisteredDate(isoDate) {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${m}/${d}/${y}`
}
