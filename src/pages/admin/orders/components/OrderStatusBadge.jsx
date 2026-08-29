const STYLES = {
  new: 'bg-sky-100 text-sky-700',
  pending:
    'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
  processing: 'bg-pink-100 text-pink-700',
  in_production: 'bg-amber-100 text-amber-800',
  produced: 'bg-violet-100 text-violet-700',
  ready: 'bg-indigo-100 text-indigo-700',
  assigned: 'bg-gray-700 text-white',
  cancel: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

export default function OrderStatusBadge({ status, label }) {
  const key = String(status || '')
    .trim()
    .toLowerCase()
  const className = STYLES[key] || 'bg-gray-100 text-[var(--secondary-text)]'

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  )
}
