export default function SettingsResultPanel({ title, children, className = '' }) {
  return (
    <div
      className={`rounded-lg border border-sky-100 bg-sky-50 px-4 py-4 ${className}`}
    >
      {title ? (
        <p className="text-xs font-bold tracking-wide text-sky-800 uppercase">
          {title}
        </p>
      ) : null}
      <div className={title ? 'mt-2 space-y-1' : 'space-y-1'}>{children}</div>
    </div>
  )
}
