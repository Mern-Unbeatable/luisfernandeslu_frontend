const STATUS_STYLES = {
  produced: 'bg-sky-100 text-sky-700',
  'in-production':
    'bg-[color-mix(in_srgb,var(--active)_15%,transparent)] text-[var(--active)]',
  'in production':
    'bg-[color-mix(in_srgb,var(--active)_15%,transparent)] text-[var(--active)]',
  ready: 'bg-pink-100 text-pink-700',
  assigned: 'bg-gray-700 text-white',
  cancel: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-emerald-100 text-emerald-700',
  default: 'bg-gray-100 text-[var(--secondary-text)]',
}

export default function StatusBadge({ status, label, className = '' }) {
  const key = String(status || label || '')
    .trim()
    .toLowerCase()
  const styles = STATUS_STYLES[key] || STATUS_STYLES.default

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${styles} ${className}`}
    >
      {label || status}
    </span>
  )
}
