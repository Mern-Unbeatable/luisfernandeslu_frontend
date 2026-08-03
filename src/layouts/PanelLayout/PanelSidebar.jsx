import { NavLink, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiLogOut, FiX } from 'react-icons/fi'

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'

function activeClasses(variant) {
  if (variant === 'soft') {
    return 'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]'
  }
  return 'bg-[var(--active)] text-white'
}

/** Panel left nav only (no logo — logo lives in PanelHeader). */
export default function PanelSidebar({
  items = [],
  onLogout,
  onClose,
  activeVariant = 'solid',
  showMainMenu = true,
  className = '',
}) {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const qs = params.toString()

  return (
    <aside
      className={`flex h-full w-full shrink-0 flex-col border-r border-gray-200 bg-white lg:w-64 ${className}`}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        {showMainMenu ? (
          <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            {t('panel.mainMenu')}
          </p>
        ) : (
          <span />
        )}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[var(--secondary-text)] hover:bg-gray-100 lg:hidden"
            aria-label={t('panel.closeMenu')}
          >
            <FiX className="size-5" />
          </button>
        ) : null}
      </div>

      <nav
        aria-label={t('panel.mainMenu')}
        className="flex-1 overflow-y-auto px-3 pb-4"
      >
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const to = qs ? `${item.to}?${qs}` : item.to
            const Icon = item.Icon
            return (
              <li key={item.to}>
                <NavLink
                  to={to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive
                        ? activeClasses(activeVariant)
                        : 'text-[var(--secondary-text)] hover:bg-gray-50 hover:text-[var(--primary-text)]'
                    }`
                  }
                >
                  {Icon ? (
                    <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
                  ) : null}
                  <span className="truncate">{t(item.labelKey)}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto px-3 py-4">
        <button
          type="button"
          onClick={onLogout}
          className={`${linkBase} w-full text-red-500 hover:bg-red-50`}
        >
          <FiLogOut className="size-[18px] shrink-0" strokeWidth={1.75} />
          {t('panel.logOut')}
        </button>
      </div>
    </aside>
  )
}
