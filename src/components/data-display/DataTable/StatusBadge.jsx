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
  shipped: 'bg-sky-100 text-sky-700',
  processing:
    'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
  delivered: 'bg-emerald-100 text-emerald-700',
  progress: 'bg-cyan-100 text-cyan-800',
  pending: 'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
  under_review: 'bg-sky-100 text-sky-800',
  resolved: 'bg-emerald-100 text-emerald-700',
  assign: 'bg-violet-100 text-violet-700',
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
