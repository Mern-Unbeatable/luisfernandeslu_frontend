import SettingsUnsavedBadge from './SettingsUnsavedBadge'

export default function SettingsConfigCard({
  icon: Icon,
  title,
  unsaved,
  unsavedLabel,
  children,
  onSave,
  onReset,
  saveLabel,
  resetLabel,
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {Icon ? (
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_16%,white)] text-[var(--active)]">
              <Icon className="size-[18px]" strokeWidth={2} aria-hidden />
            </span>
          ) : null}
          <h3 className="text-base font-bold text-[var(--primary-text)]">
            {title}
          </h3>
        </div>
        {unsaved ? <SettingsUnsavedBadge label={unsavedLabel} /> : null}
      </div>
      <div className="flex-1">{children}</div>
      {onSave || onReset ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {onSave ? (
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-10 items-center rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95"
            >
              {saveLabel}
            </button>
          ) : null}
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
            >
              {resetLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
