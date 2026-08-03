import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiMenu } from 'react-icons/fi'

/** Full-width panel top bar: logo left, user right. */
export default function PanelHeader({
  userName = 'Atik Adnan',
  roleLabel,
  onMenuOpen,
}) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="rounded-md p-2 text-[var(--secondary-text)] hover:bg-gray-50 lg:hidden"
          aria-label={t('panel.openMenu')}
        >
          <FiMenu className="size-5" />
        </button>

        <Link to="/panel" className="inline-flex shrink-0 items-center">
          <img
            src="/logo.png"
            alt="CONSTRUPRECO"
            width={80}
            height={40}
            className="h-9 w-auto"
            decoding="async"
          />
        </Link>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-[var(--primary-text)]">
          {userName}
        </p>
        <p className="text-xs text-[var(--secondary-text)]">{roleLabel}</p>
      </div>
    </header>
  )
}
