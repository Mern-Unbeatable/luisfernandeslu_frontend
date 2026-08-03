import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiMenu, FiX } from 'react-icons/fi'
import Header from '../PublicLayout/Header'
import Footer from '../PublicLayout/Footer'
import Seo from '../../components/common/Seo/Seo'
import BuyerSidebar from './BuyerSidebar'
import { getBuyerRoleConfig } from '../../roles'

/**
 * BuyerLayout — customer + company account shell.
 * Widths use % so small devices keep content visible.
 */
export default function BuyerLayout({
  role = 'company',
  userName = 'John',
  onLogout,
}) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const roleConfig = getBuyerRoleConfig(role)
  const crumbKey =
    roleConfig.breadcrumbs[pathname] || 'buyer.dashboard'

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Seo />
      <Header />

      <div className="w-full bg-[#EFF0F1] py-6 sm:py-10">
        <h1 className="text-center text-2xl font-bold text-[var(--primary-text)] sm:text-3xl md:text-4xl">
          {t('buyer.myAccount')}
        </h1>
      </div>

      <main className="mx-auto w-full max-w-full flex-1 px-[4%] py-6 sm:container sm:px-4 sm:py-8">
        <div className="mb-5 flex w-full items-center justify-between gap-3 border-b border-gray-200 pb-4 lg:mb-8">
          <nav
            aria-label="Breadcrumb"
            className="min-w-0 flex-1 text-sm text-[var(--secondary-text)]"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <NavLink to="/" className="hover:text-[var(--active)]">
                  {t('buyer.home')}
                </NavLink>
              </li>
              <li aria-hidden className="text-gray-400">
                &gt;
              </li>
              <li className="font-medium text-[var(--primary-text)]">
                {t(crumbKey)}
              </li>
            </ol>
          </nav>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-[var(--primary-text)] hover:border-[var(--active)] hover:text-[var(--active)] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="buyer-account-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <FiX className="size-5" strokeWidth={2} />
            ) : (
              <FiMenu className="size-5" strokeWidth={2} />
            )}
            <span>{t('buyer.menu')}</span>
          </button>
        </div>

        <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-[5%]">
          {/* Desktop sidebar — % of row */}
          <div className="hidden w-full shrink-0 lg:block lg:w-[22%]">
            <BuyerSidebar items={roleConfig.nav} onLogout={onLogout} />
          </div>

          {/* Mobile drawer: 80% width, slides left → right */}
          <div
            className={`fixed inset-0 z-40 lg:hidden ${
              menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            aria-hidden={!menuOpen}
          >
            <button
              type="button"
              tabIndex={menuOpen ? 0 : -1}
              className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
                menuOpen ? 'opacity-100' : 'opacity-0'
              }`}
              aria-label={t('buyer.closeMenu')}
              onClick={() => setMenuOpen(false)}
            />
            <div
              id="buyer-account-menu"
              className={`absolute top-0 left-0 flex h-full w-[80%] max-w-full flex-col bg-white shadow-xl transition-transform duration-300 ease-out will-change-transform ${
                menuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
                <p className="text-base font-semibold text-[var(--primary-text)]">
                  {t('buyer.myAccount')}
                </p>
                <button
                  type="button"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md p-2 text-[var(--secondary-text)] hover:bg-gray-50"
                  aria-label={t('buyer.closeMenu')}
                >
                  <FiX className="size-5" />
                </button>
              </div>
              <div className="w-full overflow-y-auto px-[5%] py-2">
                <BuyerSidebar
                  items={roleConfig.nav}
                  onLogout={() => {
                    setMenuOpen(false)
                    onLogout?.()
                  }}
                  onNavigate={() => setMenuOpen(false)}
                />
              </div>
            </div>
          </div>

          {/* Main content — full width on mobile */}
          <div className="w-full min-w-0 flex-1 lg:w-[73%]">
            <Outlet context={{ userName, onLogout, role, roleConfig }} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
