const STYLES = {
  pending:
    'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
  under_review: 'bg-sky-100 text-sky-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}

export default function DisputeStatusBadge({ status, label }) {
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
