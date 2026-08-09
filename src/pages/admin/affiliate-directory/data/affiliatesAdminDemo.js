export const ADMIN_AFFILIATE_STATS = {
  totalAffiliates: '8',
  activeAffiliates: '6',
  referredClients: '18',
  marketplaceRevenue: '$190,100',
  totalCommissionPaid: '$3,650',
  pendingCommission: '$4,820',
}

export const ADMIN_AFFILIATE_MAIN_TABS = [
  { id: 'members', labelKey: 'adminAffiliateDirectory.tabs.members' },
  { id: 'payout', labelKey: 'adminAffiliateDirectory.tabs.payoutControl' },
  { id: 'level', labelKey: 'adminAffiliateDirectory.tabs.levelControl' },
]

export const ADMIN_AFFILIATE_DETAIL_TABS = [
  { id: 'clients', labelKey: 'adminAffiliateDirectory.detail.tabs.clients' },
  { id: 'analytics', labelKey: 'adminAffiliateDirectory.detail.tabs.analytics' },
  {
    id: 'commissions',
    labelKey: 'adminAffiliateDirectory.detail.tabs.commissions',
  },
  { id: 'payouts', labelKey: 'adminAffiliateDirectory.detail.tabs.payouts' },
]

export const ADMIN_AFFILIATES = [
  {
    id: 'aff-001',
    affiliateId: 'aff-001',
    name: 'Alex Rivers',
    email: 'alex.rivers@affiliate.co',
    referralCode: 'ALEXRIVERS15',
    level: 'Platinum',
    tierRate: 15,
    totalClients: 54,
    activeClients: 48,
    clientCap: 70,
    revenueGenerated: '$92,400',
    commissionEarned: '$13,860',
    pendingCommission: '$1,240',
    status: 'active',
    joined: '2025-01-12',
    revenue: '$92,400',
    earned: '$13,860',
    clients: 54,
  },
  {
    id: 'aff-002',
    affiliateId: 'aff-002',
    name: 'Sarah Corp',
    email: 'sarah.corp@affiliate.co',
    referralCode: 'SARAHCORP10',
    level: 'Gold',
    tierRate: 10,
    totalClients: 32,
    activeClients: 28,
    clientCap: 40,
    revenueGenerated: '$32,500',
    commissionEarned: '$3,250',
    pendingCommission: '$420',
    status: 'active',
    joined: '2025-02-03',
    revenue: '$32,500',
    earned: '$3,250',
    clients: 32,
  },
  {
    id: 'aff-003',
    affiliateId: 'aff-003',
    name: 'Build Partners LLC',
    email: 'build@partners.co',
    referralCode: 'BUILDPRO08',
    level: 'Silver',
    tierRate: 8,
    totalClients: 18,
    activeClients: 12,
    clientCap: 25,
    revenueGenerated: '$18,200',
    commissionEarned: '$1,456',
    pendingCommission: '$180',
    status: 'suspended',
    joined: '2025-03-11',
    revenue: '$18,200',
    earned: '$1,456',
    clients: 18,
  },
  {
    id: 'aff-004',
    affiliateId: 'aff-004',
    name: 'Mason Referrals',
    email: 'mason@referrals.co',
    referralCode: 'MASON12',
    level: 'Gold',
    tierRate: 12,
    totalClients: 22,
    activeClients: 19,
    clientCap: 30,
    revenueGenerated: '$24,800',
    commissionEarned: '$2,976',
    pendingCommission: '$310',
    status: 'active',
    joined: '2025-01-28',
    revenue: '$24,800',
    earned: '$2,976',
    clients: 22,
  },
  {
    id: 'aff-005',
    affiliateId: 'aff-005',
    name: 'Cement Connect',
    email: 'hello@cementconnect.co',
    referralCode: 'CEMENT15',
    level: 'Platinum',
    tierRate: 15,
    totalClients: 41,
    activeClients: 36,
    clientCap: 50,
    revenueGenerated: '$58,100',
    commissionEarned: '$8,715',
    pendingCommission: '$890',
    status: 'active',
    joined: '2024-11-05',
    revenue: '$58,100',
    earned: '$8,715',
    clients: 41,
  },
  {
    id: 'aff-006',
    affiliateId: 'aff-006',
    name: 'Priya Nair',
    email: 'priya.nair@affiliate.co',
    referralCode: 'PRIYA10',
    level: 'Silver',
    tierRate: 10,
    totalClients: 9,
    activeClients: 7,
    clientCap: 15,
    revenueGenerated: '$9,400',
    commissionEarned: '$940',
    pendingCommission: '$95',
    status: 'active',
    joined: '2025-04-02',
    revenue: '$9,400',
    earned: '$940',
    clients: 9,
  },
  {
    id: 'aff-007',
    affiliateId: 'aff-007',
    name: 'North Star Affiliates',
    email: 'team@northstar.co',
    referralCode: 'NORTHSTAR12',
    level: 'Gold',
    tierRate: 12,
    totalClients: 15,
    activeClients: 11,
    clientCap: 20,
    revenueGenerated: '$14,600',
    commissionEarned: '$1,752',
    pendingCommission: '$210',
    status: 'suspended',
    joined: '2025-02-19',
    revenue: '$14,600',
    earned: '$1,752',
    clients: 15,
  },
]

const REFERRED_CLIENTS = [
  {
    id: 'rc-1',
    name: 'John Anderson',
    email: 'john.anderson@email.com',
    phone: '+0123-456 789',
    joinDate: '2026-05-01',
    plan: 'Customer',
    generatedRevenue: '$24,000',
    affiliateCommission: '$12,000',
    expiryDate: '2026-05-01',
    status: 'active',
  },
  {
    id: 'rc-2',
    name: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    phone: '+0123-456 789',
    joinDate: '2026-04-30',
    plan: 'Customer',
    generatedRevenue: '$24,000',
    affiliateCommission: '$12,000',
    expiryDate: '2026-05-01',
    status: 'suspended',
  },
  {
    id: 'rc-3',
    name: 'BuildPro Corp',
    email: 'ops@buildpro.co',
    phone: '+0123-456 789',
    joinDate: '2026-04-28',
    plan: 'Company',
    generatedRevenue: '$24,000',
    affiliateCommission: '$12,000',
    expiryDate: '2026-06-01',
    status: 'active',
  },
  {
    id: 'rc-4',
    name: 'BuildPro Corp',
    email: 'billing@buildpro.co',
    phone: '+0123-456 789',
    joinDate: '2026-04-25',
    plan: 'Company',
    generatedRevenue: '$24,000',
    affiliateCommission: '$12,000',
    expiryDate: '2026-06-01',
    status: 'active',
  },
  {
    id: 'rc-5',
    name: 'BuildPro Corp',
    email: 'projects@buildpro.co',
    phone: '+0123-456 789',
    joinDate: '2026-04-22',
    plan: 'Company',
    generatedRevenue: '$24,000',
    affiliateCommission: '$12,000',
    expiryDate: '2026-06-01',
    status: 'active',
  },
  {
    id: 'rc-6',
    name: 'BuildPro Corp',
    email: 'site@buildpro.co',
    phone: '+0123-456 789',
    joinDate: '2026-04-20',
    plan: 'Company',
    generatedRevenue: '$24,000',
    affiliateCommission: '$12,000',
    expiryDate: '2026-06-01',
    status: 'active',
  },
  {
    id: 'rc-7',
    name: 'BuildPro Corp',
    email: 'hq@buildpro.co',
    phone: '+0123-456 789',
    joinDate: '2026-04-18',
    plan: 'Company',
    generatedRevenue: '$24,000',
    affiliateCommission: '$12,000',
    expiryDate: '2026-06-01',
    status: 'active',
  },
]

const COMMISSION_LOG = [
  {
    id: 'cm-1',
    transactionLabel: 'John Anderson',
    date: '2026-05-01',
    sourceName: 'John Anderson',
    sourceEmail: 'john.anderson@email.com',
    purchaseSize: '$12,000',
    rate: '15%',
    earned: '$1,800',
    status: 'approved',
  },
  {
    id: 'cm-2',
    transactionLabel: 'Sarah Mitchell',
    date: '2026-04-30',
    sourceName: 'Sarah Mitchell',
    sourceEmail: 'sarah.m@email.com',
    purchaseSize: '$12,000',
    rate: '15%',
    earned: '$1,800',
    status: 'approved',
  },
  {
    id: 'cm-3',
    transactionLabel: 'BuildPro Corp',
    date: '2026-04-28',
    sourceName: 'BuildPro Corp',
    sourceEmail: 'ops@buildpro.co',
    purchaseSize: '$12,000',
    rate: '15%',
    earned: '$1,800',
    status: 'approved',
  },
  {
    id: 'cm-4',
    transactionLabel: 'Metro Supplies',
    date: '2026-04-25',
    sourceName: 'Metro Supplies',
    sourceEmail: 'sales@metro.co',
    purchaseSize: '$10,500',
    rate: '15%',
    earned: '$1,575',
    status: 'approved',
  },
  {
    id: 'cm-5',
    transactionLabel: 'Skyline Projects',
    date: '2026-04-22',
    sourceName: 'Skyline Projects',
    sourceEmail: 'finance@skyline.co',
    purchaseSize: '$9,800',
    rate: '15%',
    earned: '$1,470',
    status: 'approved',
  },
  {
    id: 'cm-6',
    transactionLabel: 'Porto Mix Plant',
    date: '2026-04-18',
    sourceName: 'Porto Mix Plant',
    sourceEmail: 'orders@portomix.co',
    purchaseSize: '$11,200',
    rate: '15%',
    earned: '$1,680',
    status: 'approved',
  },
  {
    id: 'cm-7',
    transactionLabel: 'Downtown Builders',
    date: '2026-04-15',
    sourceName: 'Downtown Builders',
    sourceEmail: 'team@downtown.co',
    purchaseSize: '$8,400',
    rate: '15%',
    earned: '$1,260',
    status: 'approved',
  },
]

const PAYOUT_HISTORY = [
  {
    id: 'pay-001',
    referenceId: 'Pay-001',
    requestedDate: '2026-05-01',
    method: 'Stripe',
    accountNumber: '(702) 555-0122',
    amount: '$12,000',
    status: 'pending',
  },
  {
    id: 'pay-005',
    referenceId: 'Pay-005',
    requestedDate: '2026-04-30',
    method: 'Stripe',
    accountNumber: '(702) 555-0122',
    amount: '$12,000',
    status: 'paid',
  },
  {
    id: 'pay-004',
    referenceId: 'Pay-004',
    requestedDate: '2026-04-15',
    method: 'Stripe',
    accountNumber: '(702) 555-0122',
    amount: '$8,500',
    status: 'paid',
  },
  {
    id: 'pay-003',
    referenceId: 'Pay-003',
    requestedDate: '2026-03-28',
    method: 'Bank Transfer',
    accountNumber: '**** 4421',
    amount: '$6,200',
    status: 'paid',
  },
  {
    id: 'pay-002',
    referenceId: 'Pay-002',
    requestedDate: '2026-03-10',
    method: 'Stripe',
    accountNumber: '(702) 555-0122',
    amount: '$5,400',
    status: 'paid',
  },
  {
    id: 'pay-006',
    referenceId: 'Pay-006',
    requestedDate: '2026-02-22',
    method: 'PayPal',
    accountNumber: 'alex.rivers@affiliate.co',
    amount: '$4,100',
    status: 'paid',
  },
  {
    id: 'pay-007',
    referenceId: 'Pay-007',
    requestedDate: '2026-02-01',
    method: 'Stripe',
    accountNumber: '(702) 555-0122',
    amount: '$3,800',
    status: 'paid',
  },
]

export const AFFILIATE_CHART_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const AFFILIATE_MARKETPLACE_SERIES = [
  42000, 38000, 45000, 52000, 48000, 55000, 51000, 58000, 54000, 60000, 57000,
  62000,
]

export const AFFILIATE_COMMISSION_SERIES = [
  4200, 3800, 4500, 5200, 4800, 5500, 5100, 5800, 5400, 6000, 5700, 6200,
]

export const ADMIN_PAYOUT_REQUESTS = [
  {
    id: 'pr-1',
    name: 'Rajesh Kumar',
    email: 'rajesh@rk.com',
    totalEarnings: '$28,500',
    requested: '$28,500',
    pending: '$20,000',
    accountNumber: '(702) 555-0122',
    requestDate: '2026-05-01',
    status: 'paid',
  },
  {
    id: 'pr-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@affiliate.co',
    totalEarnings: '$18,200',
    requested: '$12,000',
    pending: '$10,000',
    accountNumber: '(702) 555-0122',
    requestDate: '2026-04-28',
    status: 'rejected',
  },
  {
    id: 'pr-3',
    name: 'Alex Rivers',
    email: 'alex.rivers@affiliate.co',
    totalEarnings: '$92,400',
    requested: '$25,000',
    pending: '$25,000',
    accountNumber: '(702) 555-0122',
    requestDate: '2026-04-25',
    status: 'approved',
  },
  {
    id: 'pr-4',
    name: 'Sarah Corp',
    email: 'sarah.corp@affiliate.co',
    totalEarnings: '$32,500',
    requested: '$8,500',
    pending: '$8,500',
    accountNumber: '(702) 555-0122',
    requestDate: '2026-04-22',
    status: 'pending',
  },
  {
    id: 'pr-5',
    name: 'Mason Referrals',
    email: 'mason@referrals.co',
    totalEarnings: '$24,800',
    requested: '$6,200',
    pending: '$6,200',
    accountNumber: '**** 4421',
    requestDate: '2026-04-18',
    status: 'pending',
  },
  {
    id: 'pr-6',
    name: 'Cement Connect',
    email: 'hello@cementconnect.co',
    totalEarnings: '$58,100',
    requested: '$15,000',
    pending: '$15,000',
    accountNumber: '(702) 555-0122',
    requestDate: '2026-04-15',
    status: 'approved',
  },
  {
    id: 'pr-7',
    name: 'Build Partners LLC',
    email: 'build@partners.co',
    totalEarnings: '$18,200',
    requested: '$4,800',
    pending: '$4,800',
    accountNumber: '(702) 555-0199',
    requestDate: '2026-04-10',
    status: 'paid',
  },
]

export function filterPayoutRequestsByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

/** @deprecated use ADMIN_PAYOUT_REQUESTS */
export const ADMIN_PAYOUT_CONTROL_ROWS = ADMIN_PAYOUT_REQUESTS

export const ADMIN_COMMISSION_LEVELS = [
  {
    id: 'lvl-starter',
    name: 'Starter Level',
    subtitleKey: 'entryLevel',
    commissionPercent: 5,
    membersRequired: 0,
    description: 'Recurring Lifetime payout spilt',
    isActive: true,
  },
  {
    id: 'lvl-bronze',
    name: 'Bronze Level',
    subtitleKey: 'bronzeTier',
    commissionPercent: 10,
    membersRequired: 5,
    description: 'Recurring Lifetime payout spilt',
    isActive: false,
  },
  {
    id: 'lvl-silver',
    name: 'Silver Level',
    subtitleKey: 'silverTier',
    commissionPercent: 12,
    membersRequired: 15,
    description: 'Recurring Lifetime payout spilt',
    isActive: false,
  },
  {
    id: 'lvl-gold',
    name: 'Gold Level',
    subtitleKey: 'goldTier',
    commissionPercent: 15,
    membersRequired: 30,
    description: 'Recurring Lifetime payout spilt',
    isActive: false,
  },
  {
    id: 'lvl-premium',
    name: 'Premium Level',
    subtitleKey: 'premiumTier',
    commissionPercent: 20,
    membersRequired: 50,
    description: 'Recurring Lifetime payout spilt',
    isActive: false,
  },
]

export function filterAffiliatesByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

export function filterAffiliatesBySearch(rows, query) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q) return rows
  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.affiliateId.toLowerCase().includes(q) ||
      row.referralCode.toLowerCase().includes(q),
  )
}

export function filterClientsByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

export function filterClientsByPlan(rows, plan) {
  if (!plan || plan === 'all') return rows
  return rows.filter(
    (row) => String(row.plan).toLowerCase() === String(plan).toLowerCase(),
  )
}

export function filterCommissionsByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

export function filterPayoutHistoryByStatus(rows, status) {
  if (!status || status === 'all') return rows
  return rows.filter(
    (row) => String(row.status).toLowerCase() === String(status).toLowerCase(),
  )
}

export function getAdminAffiliateRow(id) {
  return ADMIN_AFFILIATES.find((row) => row.id === id) ?? null
}

export function getAdminAffiliateDetail(id) {
  const affiliate = getAdminAffiliateRow(id)
  if (!affiliate) return null

  return {
    ...affiliate,
    referredClients: REFERRED_CLIENTS,
    commissionLog: COMMISSION_LOG,
    payoutHistory: PAYOUT_HISTORY,
  }
}
