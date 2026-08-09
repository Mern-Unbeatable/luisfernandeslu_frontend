import { useTranslation } from 'react-i18next'
import { FiFilter, FiSearch } from 'react-icons/fi'

export default function ReturnsCenterToolbar({
  tab,
  onTabChange,
  query,
  onQueryChange,
  className = '',
}) {
  const { t } = useTranslation()

  return (
    <div className={className}>
      <div className="inline-flex rounded-lg bg-[#F3F4F6] p-1">
        <button
          type="button"
          onClick={() => onTabChange?.('orders')}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            tab === 'orders'
              ? 'bg-[#FEF5E7] text-[var(--primary-text)] shadow-sm'
              : 'text-[var(--secondary-text)]'
          }`}
        >
          {t('returnsCenter.tabOrders')}
        </button>
        <button
          type="button"
          onClick={() => onTabChange?.('return')}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            tab === 'return'
              ? 'bg-[#FEF5E7] text-[var(--primary-text)] shadow-sm'
              : 'text-[var(--secondary-text)]'
          }`}
        >
          {t('returnsCenter.tabReturn')}
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        <label className="relative min-w-0 flex-1">
          <FiSearch
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder={t('returnsCenter.searchPlaceholder')}
            className="h-11 w-full rounded-lg border border-gray-200 py-2 pr-3 pl-10 text-sm outline-none focus:border-[var(--active)]"
          />
        </label>
        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[var(--primary-text)] hover:border-[var(--active)]"
          aria-label={t('returnsCenter.filter')}
        >
          <FiFilter className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
