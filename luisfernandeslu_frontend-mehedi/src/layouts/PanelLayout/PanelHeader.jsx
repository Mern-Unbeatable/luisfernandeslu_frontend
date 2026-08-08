import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiMenu } from 'react-icons/fi'
import LanguageSwitcher from '../../components/common/LanguageSwitcher/LanguageSwitcher'

/** Full-width panel top bar: logo left, language + user right. */
export default function PanelHeader({
  userName = 'Atik Adnan',
  roleLabel,
  homeTo = '/',
  onMenuOpen,
}) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:gap-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="rounded-md p-2 text-[var(--secondary-text)] hover:bg-gray-50 lg:hidden"
          aria-label={t('panel.openMenu')}
        >
          <FiMenu className="size-5" />
        </button>

        <Link to={homeTo} className="inline-flex shrink-0 items-center">
          <img
            src="/logo.png"
            alt="CONSTRUPRECO"
            width={80}
            height={40}
            className="h-8 w-auto sm:h-9"
            decoding="async"
          />
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
        <LanguageSwitcher compact className="sm:hidden" />
        <LanguageSwitcher className="hidden sm:block" />

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[var(--primary-text)]">
            {userName}
          </p>
          <p className="text-xs text-[var(--secondary-text)]">{roleLabel}</p>
        </div>
      </div>
    </header>
  )
}
