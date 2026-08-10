export default function TypeBadge({ label }) {
  const isCompany = String(label).toLowerCase() === 'company'
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
        isCompany
          ? 'bg-sky-100 text-sky-800'
          : 'bg-sky-100 text-sky-700'
      }`}
    >
      {label}
    </span>
  )
}
