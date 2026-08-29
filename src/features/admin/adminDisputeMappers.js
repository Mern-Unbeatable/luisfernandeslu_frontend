/** Map backend dispute list row */
export function mapAdminDispute(dispute) {
  return {
    id: dispute.id,
    disputeId: dispute.id,
    orderId: dispute.orderId,
    customer: dispute.customer,
    supplier: dispute.supplier,
    issue: dispute.issue,
    status: String(dispute.status || '')
      .trim()
      .toLowerCase(),
    registered: dispute.registered,
  }
}

/** Map backend dispute detail */
export function mapAdminDisputeDetail(data) {
  if (!data) return null

  return {
    id: data.id,
    orderId: data.orderId,
    status: String(data.status || '')
      .trim()
      .toLowerCase(),
    createdAt: data.createdAt,
    description: data.description,
    items: data.items || [],
    evidence: data.evidence || [],
    chat: data.chat,
    messages: data.messages || [],
  }
}
