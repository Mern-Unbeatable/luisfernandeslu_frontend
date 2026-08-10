export default function AffiliateDirectoryTabsBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="inline-flex w-fit max-w-full shrink-0 items-center rounded-lg bg-gray-100 p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange?.(tab.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
              isActive
                ? 'bg-[var(--active)] text-white shadow-sm'
                : 'bg-transparent text-[var(--primary-text)] hover:bg-white/80'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
