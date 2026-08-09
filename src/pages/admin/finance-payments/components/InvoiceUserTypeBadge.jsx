const STYLES = {
  supplier: 'bg-gray-100 text-gray-800',
  factory:
    'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
  transporter: 'bg-sky-100 text-sky-800',
}

export default function InvoiceUserTypeBadge({ userType, label }) {
  const key = String(userType || '')
    .trim()
    .toLowerCase()
  const className = STYLES[key] || 'bg-gray-100 text-[var(--secondary-text)]'

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize whitespace-nowrap ${className}`}
    >
      {label || userType}
    </span>
  )
}
