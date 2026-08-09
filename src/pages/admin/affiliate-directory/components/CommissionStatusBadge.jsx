export default function CommissionStatusBadge({ status, label }) {
  const key = String(status || '').toLowerCase()
  const styles =
    key === 'approved'
      ? 'bg-emerald-100 text-emerald-700'
      : key === 'pending'
        ? 'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]'
        : 'bg-gray-100 text-[var(--secondary-text)]'

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium capitalize whitespace-nowrap ${styles}`}
    >
      {label || status}
    </span>
  )
}
