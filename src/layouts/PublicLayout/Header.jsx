import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Logo from '../../components/common/Logo/Logo'
import LanguageSwitcher from '../../components/common/LanguageSwitcher/LanguageSwitcher'
import {
  FiSearch,
  FiMessageSquare,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
} from 'react-icons/fi'
import {
  FaTwitter,
  FaFacebook,
  FaPinterest,
  FaRedditAlien,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa'

const socialLinks = [
  { Icon: FaTwitter, label: 'Twitter' },
  { Icon: FaFacebook, label: 'Facebook' },
  { Icon: FaPinterest, label: 'Pinterest' },
  { Icon: FaRedditAlien, label: 'Reddit' },
  { Icon: FaYoutube, label: 'YouTube' },
  { Icon: FaInstagram, label: 'Instagram' },
]

/**
 * Public site header.
 * Guest (logged out): matches marketing header — search + SIGN UP / LOG IN.
 * Authenticated: top bar + account icon.
 */
export default function Header() {
  const { t } = useTranslation()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerBottom, setHeaderBottom] = useState(0)
  const headerRef = useRef(null)

  useEffect(() => {
    const updateHeaderBottom = () => {
      if (!headerRef.current) return
      setHeaderBottom(headerRef.current.getBoundingClientRect().bottom)
    }

    updateHeaderBottom()
    window.addEventListener('resize', updateHeaderBottom)
    window.addEventListener('scroll', updateHeaderBottom, { passive: true })

    return () => {
      window.removeEventListener('resize', updateHeaderBottom)
      window.removeEventListener('scroll', updateHeaderBottom)
    }
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const utilityIcons = [
    { Icon: FiMessageSquare, key: 'messages' },
    { Icon: FiShoppingCart, key: 'cart' },
  ]

  return (
    <header ref={headerRef} className="relative sticky top-0 z-50 w-full">
      {/* Top promo bar — authenticated only */}
      {isAuthenticated ? (
        <div className="hidden w-full bg-zinc-950 shadow-[inset_0px_-1px_0px_0px_rgba(255,255,255,0.16)] md:block">
          <div className="container mx-auto flex w-full items-center justify-between gap-4 px-6 py-3">
            <p className="truncate text-sm leading-5 font-normal text-white">
              {t('header.welcome')}
            </p>
            <div className="flex shrink-0 items-center justify-center gap-3">
              <span className="text-sm leading-5 font-normal text-white">
                {t('header.followUs')}
              </span>
              <div className="flex items-start gap-3">
                {socialLinks.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="text-white transition-colors hover:text-[var(--active)]"
                  >
                    <Icon className="size-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile header */}
      <div className="relative z-50 w-full border-b border-gray-100 bg-white md:hidden">
        <div className="flex items-center gap-2.5 px-4 py-4">
          <Logo className="shrink-0" />

          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
            <input
              type="search"
              placeholder={t('header.searchPlaceholderShort')}
              className="w-full min-w-0 bg-transparent text-sm text-[var(--secondary-text)] outline-none placeholder:text-gray-400"
            />
            <FiSearch
              className="size-3.5 shrink-0 text-[var(--secondary-text)]"
              aria-hidden
            />
          </label>

          <button
            type="button"
            aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="shrink-0 p-1 text-[var(--primary-text)]"
          >
            {menuOpen ? (
              <FiX className="size-5" strokeWidth={2} />
            ) : (
              <FiMenu className="size-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden w-full border-b border-gray-100 bg-white md:block">
        <div className="container mx-auto flex w-full items-center justify-between gap-6 px-4 py-3.5">
          <Logo />

          <div className="mx-4 flex max-w-[560px] flex-1 lg:mx-8">
            <label className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 focus-within:border-[var(--active)]">
              <input
                type="search"
                placeholder={t('header.searchPlaceholder')}
                className="w-full min-w-0 bg-transparent text-sm leading-5 text-[var(--secondary-text)] outline-none placeholder:text-gray-400"
              />
              <FiSearch
                className="size-5 shrink-0 text-[var(--secondary-text)]"
                aria-hidden
              />
            </label>
          </div>

          <div className="flex shrink-0 items-center gap-5 lg:gap-6">
            <LanguageSwitcher />

            {utilityIcons.map(({ Icon, key }) => (
              <button
                key={key}
                type="button"
                aria-label={t(`header.${key}`)}
                className="text-[var(--primary-text)] transition-colors hover:text-[var(--active)]"
              >
                <Icon className="size-6" strokeWidth={1.75} />
              </button>
            ))}

            {isAuthenticated ? (
              <button
                type="button"
                aria-label={t('header.account')}
                className="text-[var(--primary-text)] transition-colors hover:text-[var(--active)]"
              >
                <FiUser className="size-6" strokeWidth={1.75} />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--active)] px-4 text-sm font-semibold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
                >
                  {t('header.signUp')}
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold tracking-wide text-[var(--active)] uppercase transition-opacity hover:opacity-80"
                >
                  {t('header.logIn')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay + menu */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-black/30 transition-opacity duration-300 ease-out md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ top: headerBottom }}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`absolute top-full right-3 z-50 mt-1 w-52 origin-top-right transition-all duration-300 ease-out md:hidden ${
          menuOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex flex-col py-1">
            {utilityIcons.map(({ Icon, key }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-left text-[var(--primary-text)] transition-colors hover:bg-gray-50"
              >
                <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium">{t(`header.${key}`)}</span>
              </button>
            ))}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-left text-[var(--primary-text)] transition-colors hover:bg-gray-50"
              >
                <FiUser className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium">{t('header.account')}</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2 border-t border-gray-100 px-3 py-3">
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--active)] text-sm font-semibold tracking-wide text-white uppercase"
                >
                  {t('header.signUp')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 items-center justify-center text-sm font-semibold tracking-wide text-[var(--active)] uppercase"
                >
                  {t('header.logIn')}
                </Link>
              </div>
            )}

            <div className="border-t border-gray-100 px-2 py-2">
              <LanguageSwitcher className="w-full [&_button]:h-9 [&_button]:w-full [&_button]:justify-between" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
