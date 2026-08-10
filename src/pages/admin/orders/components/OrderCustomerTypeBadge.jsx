const STYLES = {
  company: 'bg-sky-100 text-sky-800',
  customer:
    'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
}

export default function OrderCustomerTypeBadge({ type, label }) {
  const key = String(type || '')
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
