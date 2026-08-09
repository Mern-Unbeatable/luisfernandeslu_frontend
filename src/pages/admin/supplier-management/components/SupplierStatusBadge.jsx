export default function SupplierStatusBadge({ status }) {
  const key = String(status).toLowerCase()
  let className = 'bg-emerald-100 text-emerald-700'
  if (key === 'pending') {
    className = 'bg-amber-100 text-amber-800'
  } else if (key === 'suspended') {
    className = 'bg-red-100 text-red-700'
  }

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {status}
    </span>
  )
}
