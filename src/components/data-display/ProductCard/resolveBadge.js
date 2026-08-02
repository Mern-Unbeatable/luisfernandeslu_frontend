const TAG_BADGES = {
  sponsored: { label: 'SPONSORED', className: 'bg-[var(--active)] text-white' },
  regular: { label: 'Regular', className: 'bg-green-500 text-white' },
  bulk_order: { label: 'Bulk Order', className: 'bg-violet-600 text-white' },
  featured: {
    label: 'FEATURED',
    className: 'rounded-full bg-violet-100 text-violet-700',
    icon: 'star',
  },
}

const STATUS_BADGES = {
  pending: { label: 'Pending', className: 'bg-[var(--active)] text-white' },
  active: { label: 'Active', className: 'bg-green-500 text-white' },
  featured: {
    label: 'FEATURED',
    className: 'rounded-full bg-violet-100 text-violet-700',
    icon: 'star',
  },
  rejected: { label: 'Rejected', className: 'bg-red-500 text-white' },
  completed: { label: 'Completed', className: 'bg-gray-500 text-white' },
}

/**
 * Prefer promo discount badge; else moderation status; else listing tag; else type-based.
 */
export function resolveBadge({ type, status, tag, badge, context, product }) {
  if (badge === false || badge === null) return null
  if (badge && typeof badge === 'object') return badge

  if (context === 'promo_code') {
    const label = product?.promoLabel || product?.discountLabel
    if (label) {
      return {
        label,
        className: 'rounded-full bg-[#FFF3E8] text-[#F64C00]',
      }
    }
  }

  // Admin accepted promotion as featured
  if (context === 'promotion' && (status === 'featured' || tag === 'featured')) {
    return STATUS_BADGES.featured
  }

  if (status && STATUS_BADGES[status]) {
    return STATUS_BADGES[status]
  }

  if (tag && TAG_BADGES[tag]) {
    return TAG_BADGES[tag]
  }

  if (type === 'sponsored') return TAG_BADGES.sponsored
  if (type === 'featured') return TAG_BADGES.featured

  return null
}
