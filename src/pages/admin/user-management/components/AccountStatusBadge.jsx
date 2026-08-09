export default function AccountStatusBadge({ status }) {
  const key = String(status).toLowerCase()
  const isSuspended = key === 'suspended'
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
        isSuspended
          ? 'bg-red-100 text-red-700'
          : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {status}
    </span>
  )
}
