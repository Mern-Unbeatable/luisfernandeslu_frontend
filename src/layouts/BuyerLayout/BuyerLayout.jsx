import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../PublicLayout/Header'
import Footer from '../PublicLayout/Footer'
import Seo from '../../components/common/Seo/Seo'
import BuyerSidebar from './BuyerSidebar'
import { getBuyerRoleConfig } from '../../roles'

/**
 * BuyerLayout — customer + company account shell.
 * Role config (nav / breadcrumbs) comes from `roles/`.
 */
export default function BuyerLayout({
  role = 'company',
  userName = 'John',
  onLogout,
}) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const roleConfig = getBuyerRoleConfig(role)
  const crumbKey =
    roleConfig.breadcrumbs[pathname] || 'buyer.dashboard'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Seo />
      <Header />

      <div className="w-full bg-[#EFF0F1] py-8 sm:py-10">
        <h1 className="text-center text-3xl font-bold text-[var(--primary-text)] sm:text-4xl">
          {t('buyer.myAccount')}
        </h1>
      </div>

      <main className="container mx-auto w-full flex-1 px-4 py-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 border-b border-gray-200 pb-4 text-sm text-[var(--secondary-text)]"
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

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <BuyerSidebar items={roleConfig.nav} onLogout={onLogout} />
          <div className="min-w-0 flex-1">
            <Outlet context={{ userName, onLogout, role, roleConfig }} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
