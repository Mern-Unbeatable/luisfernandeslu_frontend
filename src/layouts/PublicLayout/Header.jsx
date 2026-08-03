import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Logo from '../../components/common/Logo/Logo'
import LanguageSwitcher from '../../components/common/LanguageSwitcher/LanguageSwitcher'
import { getHomePathForRole } from '../../features/auth/demoUsers'
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
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dashboardPath = getHomePathForRole(user?.role)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [headerBottom, setHeaderBottom] = useState(0)
  const headerRef = useRef(null)
  const searchInputRef = useRef(null)

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
  }, [menuOpen, searchOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!searchOpen) return undefined
    const id = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(id)
  }, [searchOpen])

  const utilityIcons = [
    { Icon: FiMessageSquare, key: 'messages' },
    { Icon: FiShoppingCart, key: 'cart' },
  ]

  const closeSearch = () => setSearchOpen(false)

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
      <div className="relative z-50 w-full overflow-visible border-b border-gray-100 bg-white md:hidden">
        <div className="flex w-full items-center gap-2 px-3 py-3 sm:gap-2.5 sm:px-4">
          {/* Logo collapses with fixed max-width (animatable) */}
          <div
            className={`overflow-hidden transition-[max-width,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              searchOpen
                ? 'max-w-0 -translate-x-2 opacity-0'
                : 'max-w-[4.75rem] translate-x-0 opacity-100'
            }`}
          >
            <Logo className="shrink-0 [&_img]:h-8 [&_img]:w-auto" />
          </div>

          {/* Search expands via 0fr → 1fr (smooth width) */}
          <div
            className="grid min-w-0 flex-1 transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              gridTemplateColumns: searchOpen ? '1fr' : '0fr',
            }}
          >
            <div className="min-w-0 overflow-hidden">
              <label
                className={`flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:border-[var(--active)] transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  searchOpen
                    ? 'translate-x-0 opacity-100 delay-75'
                    : 'translate-x-3 opacity-0'
                }`}
              >
                <FiSearch
                  className="size-4 shrink-0 text-[var(--secondary-text)]"
                  aria-hidden
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder={t('header.searchPlaceholderShort')}
                  tabIndex={searchOpen ? 0 : -1}
                  className="w-full min-w-0 bg-transparent text-sm text-[var(--secondary-text)] outline-none placeholder:text-gray-400"
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') closeSearch()
                  }}
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  tabIndex={searchOpen ? 0 : -1}
                  className="shrink-0 rounded-full p-0.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
                  aria-label={t('header.closeSearch')}
                >
                  <FiX className="size-4" strokeWidth={2} />
                </button>
              </label>
            </div>
          </div>

          {/* Search toggle */}
          <button
            type="button"
            aria-label={t('header.search')}
            aria-expanded={searchOpen}
            onClick={() => {
              setMenuOpen(false)
              setSearchOpen((open) => !open)
            }}
            className={`shrink-0 p-1.5 text-[var(--primary-text)] transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[var(--active)] ${
              searchOpen
                ? 'pointer-events-none absolute scale-75 opacity-0'
                : 'relative scale-100 opacity-100'
            }`}
          >
            <FiSearch className="size-5" strokeWidth={1.75} />
          </button>

          {/* Lang + menu — no max-width clip (was cutting the switcher) */}
          <div
            className={`flex shrink-0 items-center gap-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              searchOpen
                ? 'pointer-events-none w-0 translate-x-2 overflow-hidden opacity-0'
                : 'translate-x-0 opacity-100'
            }`}
          >
            <LanguageSwitcher compact className="shrink-0" />

            <button
              type="button"
              aria-label={
                menuOpen ? t('header.closeMenu') : t('header.openMenu')
              }
              aria-expanded={menuOpen}
              tabIndex={searchOpen ? -1 : 0}
              onClick={() => {
                closeSearch()
                setMenuOpen((open) => !open)
              }}
              className="shrink-0 p-1.5 text-[var(--primary-text)]"
            >
              {menuOpen ? (
                <FiX className="size-5" strokeWidth={2} />
              ) : (
                <FiMenu className="size-5" strokeWidth={2} />
              )}
            </button>
          </div>
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
              <Link
                to={dashboardPath}
                aria-label={t('header.account')}
                className="text-[var(--primary-text)] transition-colors hover:text-[var(--active)]"
              >
                <FiUser className="size-6" strokeWidth={1.75} />
              </Link>
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
              <Link
                to={dashboardPath}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-left text-[var(--primary-text)] transition-colors hover:bg-gray-50"
              >
                <FiUser className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium">{t('header.account')}</span>
              </Link>
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
          </div>
        </div>
      </div>
    </header>
  )
}
