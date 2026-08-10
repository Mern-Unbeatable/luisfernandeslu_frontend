const RETURN_STATUS_STYLES = {
  pending: 'bg-pink-100 text-pink-700',
  under_review: 'bg-amber-100 text-amber-700',
  'under review': 'bg-amber-100 text-amber-700',
  approved: 'bg-sky-100 text-sky-700',
  rejected: 'bg-red-100 text-red-700',
  item_received: 'bg-emerald-100 text-emerald-700',
  'item received': 'bg-emerald-100 text-emerald-700',
  inspection_pass: 'bg-violet-100 text-violet-700',
  'inspection pass': 'bg-violet-100 text-violet-700',
  inspection_progress: 'bg-teal-100 text-teal-700',
  'inspection progress': 'bg-teal-100 text-teal-700',
  inspection_rejected: 'bg-red-100 text-red-700',
  'inspection rejected': 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-[var(--secondary-text)]',
}

export default function ReturnStatusBadge({ status, label, className = '' }) {
  const key = String(status || label || '')
    .trim()
    .toLowerCase()
  const styles = RETURN_STATUS_STYLES[key] || RETURN_STATUS_STYLES.default

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${styles} ${className}`}
    >
      {label || status}
    </span>
  )
}
