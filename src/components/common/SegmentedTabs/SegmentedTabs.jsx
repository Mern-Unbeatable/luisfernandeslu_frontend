/**
 * Pill-style segmented tabs — matches DataTable toolbar tabs.
 * standalone: one shared white bar behind all tabs (like table tabs, but white not gray).
 */
export default function SegmentedTabs({
  tabs = [],
  activeTab,
  onTabChange,
  standalone = false,
  className = '',
  ariaLabel,
}) {
  return (
    <div
      className={`inline-flex w-fit max-w-full shrink-0 flex-wrap items-center rounded-lg p-1 ${
        standalone ? 'bg-white' : 'bg-gray-100'
      } ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange?.(tab.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
              isActive
                ? 'bg-[var(--active)] text-white shadow-sm'
                : 'bg-transparent text-[var(--primary-text)] hover:bg-gray-100/80'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
