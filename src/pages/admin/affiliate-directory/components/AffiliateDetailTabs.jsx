export default function AffiliateDetailTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div
      className="flex flex-wrap gap-6 border-b border-gray-200"
      role="tablist"
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
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-[var(--primary-text)] text-[var(--primary-text)]'
                : 'border-transparent text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
