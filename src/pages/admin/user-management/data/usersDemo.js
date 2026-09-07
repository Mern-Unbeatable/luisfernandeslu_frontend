export const ADMIN_USER_STATS = {
  totalUsers: '12,453',
  b2cCustomers: '8,234',
  b2bCompanies: '4,219',
  pendingVerification: '127',
}

export const ADMIN_USER_TABS = [
  { id: 'customer', labelKey: 'adminUserManagement.tabs.customer' },
  { id: 'company', labelKey: 'adminUserManagement.tabs.company' },
]

export const ADMIN_CUSTOMER_USERS = [
  {
    id: 'u-1',
    name: 'John Anderson',
    phone: '+0123 456 789',
    email: 'john.anderson@company.com',
    type: 'Customer',
    status: 'Active',
    registered: '2026-05-12',
    address: 'Rua do Ouro 146, 3º Esq.',
  },
  {
    id: 'u-2',
    name: 'Sarah Mitchell',
    phone: '+0123 456 790',
    email: 'sarah.mitchell@email.com',
    type: 'Customer',
    status: 'Active',
    registered: '2026-04-28',
    address: 'Av. da Liberdade 88, Lisboa',
  },
  {
    id: 'u-3',
    name: 'Michael Chen',
    phone: '+0123 456 791',
    email: 'michael.chen@email.com',
    type: 'Customer',
    status: 'Suspended',
    registered: '2026-03-15',
    address: 'Rua Augusta 12, 2º',
  },
  {
    id: 'u-4',
    name: 'Emma Wilson',
    phone: '+0123 456 792',
    email: 'emma.wilson@email.com',
    type: 'Customer',
    status: 'Active',
    registered: '2026-02-20',
    address: 'Travessa do Comércio 5',
  },
  {
    id: 'u-5',
    name: 'David Brown',
    phone: '+0123 456 793',
    email: 'david.brown@email.com',
    type: 'Customer',
    status: 'Active',
    registered: '2026-01-10',
    address: 'Rua das Flores 44',
  },
  {
    id: 'u-6',
    name: 'Lisa Garcia',
    phone: '+0123 456 794',
    email: 'lisa.garcia@email.com',
    type: 'Customer',
    status: 'Suspended',
    registered: '2025-12-05',
    address: 'Praça do Comércio 1',
  },
  {
    id: 'u-7',
    name: 'James Taylor',
    phone: '+0123 456 795',
    email: 'james.taylor@email.com',
    type: 'Customer',
    status: 'Active',
    registered: '2025-11-18',
    address: 'Rua de Santa Catarina 210',
  },
]

export const ADMIN_COMPANY_USERS = [
  {
    id: 'c-1',
    name: 'BuildRight Ltd',
    phone: '+0123 456 800',
    email: 'contact@buildright.pt',
    type: 'Company',
    status: 'Active',
    registered: '2026-05-01',
    address: 'Zona Industrial de Maia, Lote 12',
  },
  {
    id: 'c-2',
    name: 'Nordic Supplies SA',
    phone: '+0123 456 801',
    email: 'info@nordicsupplies.com',
    type: 'Company',
    status: 'Active',
    registered: '2026-04-12',
    address: 'Parque Empresarial, Ed. B',
  },
  {
    id: 'c-3',
    name: 'Metro Construction',
    phone: '+0123 456 802',
    email: 'admin@metroconstruction.pt',
    type: 'Company',
    status: 'Suspended',
    registered: '2026-03-22',
    address: 'Rua do Alecrim 45',
  },
  {
    id: 'c-4',
    name: 'Atlantic Materials',
    phone: '+0123 456 803',
    email: 'hello@atlanticmaterials.pt',
    type: 'Company',
    status: 'Active',
    registered: '2026-02-14',
    address: 'Estrada Nacional 125, km 4',
  },
  {
    id: 'c-5',
    name: 'Prime Builders Group',
    phone: '+0123 456 804',
    email: 'ops@primebuilders.pt',
    type: 'Company',
    status: 'Active',
    registered: '2026-01-30',
    address: 'Av. Infante Santo 33',
  },
  {
    id: 'c-6',
    name: 'Horizon Projects',
    phone: '+0123 456 805',
    email: 'team@horizonprojects.com',
    type: 'Company',
    status: 'Active',
    registered: '2025-12-20',
    address: 'Rua Castilho 39, 7º',
  },
  {
    id: 'c-7',
    name: 'Solid Foundations',
    phone: '+0123 456 806',
    email: 'billing@solidfoundations.pt',
    type: 'Company',
    status: 'Suspended',
    registered: '2025-11-02',
    address: 'Rua da Indústria 8',
  },
]

export function filterUsersByStatus(rows, statusFilter) {
  if (!statusFilter || statusFilter === 'all') return rows
  const target = statusFilter.toLowerCase()
  return rows.filter((row) => row.status.toLowerCase() === target)
}

export function filterUsersBySearch(rows, query) {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => {
    const haystack = [
      row.name,
      row.phone,
      row.email,
      row.type,
      row.status,
      row.registered,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}
