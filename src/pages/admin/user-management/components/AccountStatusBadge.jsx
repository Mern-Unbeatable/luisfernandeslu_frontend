export default function AccountStatusBadge({ status }) {
  const key = String(status).toLowerCase()
  const isSuspended = key === 'suspended'
  const isPending = key.includes('pending')

  let className = 'bg-emerald-100 text-emerald-700'
  if (isSuspended) {
    className = 'bg-red-100 text-red-700'
  } else if (isPending) {
    className = 'bg-amber-100 text-amber-700'
  }

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {status}
    </span>
  )
}
