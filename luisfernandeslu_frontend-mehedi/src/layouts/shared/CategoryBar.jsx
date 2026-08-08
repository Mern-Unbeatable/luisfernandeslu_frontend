import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FiMenu } from 'react-icons/fi'
import { PRODUCT_CATEGORIES } from '../../data/productCategories'
import CategoryMegaMenu from './CategoryMegaMenu'

function prefersHoverOpen() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/**
 * Category / CTA strip under the public header.
 * Desktop: mega menu opens on hover over "All categories".
 * Mobile: tap to toggle.
 */
export default function CategoryBar() {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const role = user?.role
  const closeTimerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(
    PRODUCT_CATEGORIES[0]?.id,
  )

  const showAffiliate = !(isAuthenticated && role === 'affiliate')
  const showBecomeSeller = !(isAuthenticated && role === 'supplier')
  const showBecomeDeliverer = !(isAuthenticated && role === 'transporter')

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setMenuOpen(true)
  }

  const scheduleCloseMenu = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setMenuOpen(false)
    }, 180)
  }

  useEffect(() => () => clearCloseTimer(), [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <div className="relative z-40 w-full">
      <nav
        aria-label={t('categoryBar.navLabel')}
        className="relative z-20 w-full border-b border-[#f0e6d8] bg-[#FFF8EE]"
      >
        <div className="container mx-auto flex w-full flex-row items-center justify-between gap-4 px-4 py-3 sm:px-6 md:gap-6">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="category-mega-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onMouseEnter={() => {
              if (prefersHoverOpen()) openMenu()
            }}
            onMouseLeave={() => {
              if (prefersHoverOpen()) scheduleCloseMenu()
            }}
            className={`inline-flex min-h-11 shrink-0 touch-manipulation flex-row items-center gap-2 whitespace-nowrap px-1 text-sm font-medium leading-none transition-colors sm:min-h-0 sm:px-0 ${
              menuOpen
                ? 'text-[var(--active)]'
                : 'text-[var(--primary-text)] hover:text-[var(--active)]'
            }`}
          >
            <FiMenu className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            <span className="whitespace-nowrap">{t('categoryBar.allCategories')}</span>
          </button>

          <div className="flex min-w-0 flex-row items-center gap-5 sm:gap-8 md:flex-1 md:justify-start md:gap-10 md:pl-8 lg:gap-12">
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="inline-flex shrink-0 flex-row items-center gap-2 whitespace-nowrap text-sm font-medium leading-none text-[var(--primary-text)] transition-colors hover:text-[var(--active)]"
            >
              {t('categoryBar.products')}
            </Link>

            {showAffiliate ? (
              <Link
                to="/signup/affiliate"
                onClick={() => setMenuOpen(false)}
                className="inline-flex shrink-0 flex-row items-center gap-2 whitespace-nowrap text-sm font-medium leading-none text-[var(--primary-text)] transition-colors hover:text-[var(--active)]"
              >
                {t('categoryBar.affiliate')}
              </Link>
            ) : null}
          </div>

          {(showBecomeSeller || showBecomeDeliverer) ? (
            <div className="hidden shrink-0 flex-row items-center gap-3 md:flex">
              {showBecomeSeller ? (
                <Link
                  to="/signup/supplier"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--active)] px-4 text-xs font-bold tracking-wide whitespace-nowrap text-white uppercase transition-[filter] hover:brightness-95 lg:px-5 lg:text-[13px]"
                >
                  {t('categoryBar.becomeSeller')}
                </Link>
              ) : null}
              {showBecomeDeliverer ? (
                <Link
                  to="/signup/transporter"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--active)] bg-transparent px-4 text-xs font-bold tracking-wide whitespace-nowrap text-[var(--active)] uppercase transition-colors hover:bg-[color-mix(in_srgb,var(--active)_8%,transparent)] lg:px-5 lg:text-[13px]"
                >
                  {t('categoryBar.beLiberator')}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </nav>

      {menuOpen ? (
        <button
          type="button"
          aria-label={t('header.closeMenu')}
          className="fixed inset-0 z-10 bg-black/25 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {menuOpen ? (
        <div
          id="category-mega-menu"
          className="absolute top-full right-0 left-0 z-20"
          onMouseEnter={() => {
            if (prefersHoverOpen()) openMenu()
          }}
          onMouseLeave={() => {
            if (prefersHoverOpen()) scheduleCloseMenu()
          }}
        >
          <CategoryMegaMenu
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      ) : null}
    </div>
  )
}
