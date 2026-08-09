export function getPartnerInitials(partner) {
  const name = partner?.name || partner?.fullName || partner?.email || '?'
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function formatMessageTime(dateLike) {
  if (!dateLike) return ''
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike)
  if (Number.isNaN(date.getTime())) return String(dateLike)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
