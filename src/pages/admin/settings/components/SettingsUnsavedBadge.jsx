export default function SettingsUnsavedBadge({ label }) {
  if (!label) return null
  return (
    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
      {label}
    </span>
  )
}
