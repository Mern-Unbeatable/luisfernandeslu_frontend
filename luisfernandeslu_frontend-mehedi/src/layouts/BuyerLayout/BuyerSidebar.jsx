import { NavLink, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const itemBase =
  'block w-full border-b py-3.5 text-base transition-colors'

export default function BuyerSidebar({
  items = [],
  onLogout,
  onNavigate,
  className = '',
}) {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const qs = params.toString()

  return (
    <aside className={`w-full shrink-0 ${className}`}>
      <nav aria-label={t('buyer.account')} className="flex w-full flex-col">
        {items.map((item) => {
          const to = qs ? `${item.to}?${qs}` : item.to
          return (
            <NavLink
              key={item.to}
              to={to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `${itemBase} ${
                  isActive
                    ? 'border-[var(--active)] font-medium text-[var(--active)]'
                    : 'border-gray-200 text-[var(--primary-text)] hover:text-[var(--active)]'
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          )
        })}

        <button
          type="button"
          onClick={onLogout}
          className={`${itemBase} border-gray-200 text-left text-[var(--primary-text)] hover:text-[var(--active)]`}
        >
          {t('buyer.logOut')}
        </button>
      </nav>
    </aside>
  )
}
