function formatMoney(amount) {
  if (amount == null || amount === '') return '—'
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatCount(value) {
  if (value == null || value === '') return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return num.toLocaleString()
}

/** Map backend stats → stat card values */
export function mapAdminAffiliateStats(stats) {
  if (!stats) return {}

  return {
    totalAffiliates: formatCount(stats.totalAffiliates),
    activeAffiliates: formatCount(stats.activeAffiliates),
    referredClients: formatCount(stats.referredClients),
    marketplaceRevenue: formatMoney(stats.marketplaceRevenue),
    totalCommissionPaid: formatMoney(stats.totalCommissionPaid),
    pendingCommission: formatMoney(stats.pendingCommission),
  }
}

/** Map backend affiliate row → members table shape */
export function mapAdminAffiliate(affiliate) {
  const revenueGenerated = formatMoney(affiliate.revenueGenerated)
  const commissionEarned = formatMoney(affiliate.commissionEarned)
  const pendingCommission = formatMoney(affiliate.pendingCommission)

  return {
    id: affiliate.id,
    affiliateId: affiliate.affiliateId || affiliate.id,
    name: affiliate.name,
    email: affiliate.email,
    referralCode: affiliate.referralCode || '—',
    level: affiliate.level,
    tierRate: affiliate.tierRate,
    totalClients: affiliate.totalClients,
    activeClients: affiliate.activeClients,
    clientCap: affiliate.clientCap,
    revenueGenerated,
    commissionEarned,
    pendingCommission,
    status: String(affiliate.status || '')
      .trim()
      .toLowerCase(),
    joined: affiliate.joined,
    revenue: revenueGenerated,
    earned: commissionEarned,
    clients: affiliate.totalClients,
  }
}

/** Map backend affiliate detail → detail page shape */
export function mapAdminAffiliateDetail(affiliate) {
  if (!affiliate) return null

  const base = mapAdminAffiliate(affiliate)

  return {
    ...base,
    phone: affiliate.phone,
    avatarUrl: affiliate.avatarUrl,
    referredClients: affiliate.referredClients || [],
    commissionLog: affiliate.commissionLog || [],
    payoutHistory: affiliate.payoutHistory || [],
  }
}

/** Map backend referred client → clients table shape */
export function mapAdminAffiliateClient(client) {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    joinDate: client.joinDate,
    plan: client.plan,
    generatedRevenue: formatMoney(client.generatedRevenue),
    affiliateCommission: formatMoney(client.affiliateCommission),
    expiryDate: client.expiryDate,
    status: String(client.status || '')
      .trim()
      .toLowerCase(),
    referralActive: Boolean(client.referralActive),
  }
}

/** Map backend affiliate analytics → chart shape */
export function mapAdminAffiliateAnalytics(analytics) {
  if (!analytics) return null

  return {
    year: analytics.year,
    period: analytics.period,
    labels: analytics.labels || [],
    marketplaceRevenue: analytics.marketplaceRevenue || [],
    affiliateCommission: analytics.affiliateCommission || [],
    points: analytics.points || [],
  }
}

/** Map backend commission row → commissions table shape */
export function mapAdminAffiliateCommission(commission) {
  const rate = commission.rate

  return {
    id: commission.id,
    transactionLabel: commission.transactionLabel,
    date: commission.date,
    sourceName: commission.sourceName,
    sourceEmail: commission.sourceEmail,
    purchaseSize: formatMoney(commission.purchaseSize),
    rate: rate == null || rate === '' ? '—' : `${rate}%`,
    earned: formatMoney(commission.earned),
    status: String(commission.status || '')
      .trim()
      .toLowerCase(),
  }
}

/** Map backend affiliate payout row → payout history table shape */
export function mapAdminAffiliatePayout(payout) {
  return {
    id: payout.id,
    referenceId: payout.referenceId || payout.id,
    requestedDate: payout.requestedDate,
    method: payout.method,
    accountNumber: payout.accountNumber,
    amount: formatMoney(payout.amount),
    status: String(payout.status || '')
      .trim()
      .toLowerCase(),
  }
}

/** Map backend payout request row → payout control table shape */
export function mapAdminAffiliatePayoutRequest(payout) {
  return {
    id: payout.id,
    name: payout.name,
    email: payout.email,
    totalEarnings: formatMoney(payout.totalEarnings),
    requested: formatMoney(payout.requested),
    pending: formatMoney(payout.pending),
    accountNumber: payout.accountNumber,
    requestDate: payout.requestDate,
    status: String(payout.status || '')
      .trim()
      .toLowerCase(),
  }
}

/** Map backend commission level → level control card shape */
export function mapAdminAffiliateLevel(level) {
  return {
    id: level.id,
    name: level.name,
    membersRequired: level.membersRequired,
    commissionPercent: level.commissionPercent,
    description: level.description,
    requirement: level.requirement,
    isActive: Boolean(level.isActive),
    sortOrder: level.sortOrder,
  }
}
