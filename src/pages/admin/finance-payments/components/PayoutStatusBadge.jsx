const STYLES = {
  paid: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-sky-100 text-sky-700',
  rejected: 'bg-red-100 text-red-700',
  pending:
    'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
}

export default function PayoutStatusBadge({ status, label }) {
  const key = String(status || '')
    .trim()
    .toLowerCase()
  const className = STYLES[key] || 'bg-gray-100 text-[var(--secondary-text)]'

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize whitespace-nowrap ${className}`}
    >
      {label || status}
    </span>
  )
}
