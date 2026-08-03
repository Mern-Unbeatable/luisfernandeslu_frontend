import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../../components/common/Seo/Seo'
import PanelSidebar from './PanelSidebar'
import PanelHeader from './PanelHeader'
import { getPanelRoleConfig } from '../../roles'

/**
 * PanelLayout — full-width header + sidebar below (separate).
 * Role config (nav) comes from `roles/`.
 */
export default function PanelLayout({
  role = 'supplier',
  userName = 'Atik Adnan',
  onLogout,
}) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const roleConfig = getPanelRoleConfig(role)

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6F8]">
      <Seo />

      <PanelHeader
        userName={userName}
        roleLabel={t(roleConfig.labelKey)}
        homeTo="/"
        onMenuOpen={() => setMobileOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <div className="sticky top-16 hidden h-[calc(100vh-4rem)] lg:block">
          <PanelSidebar
            items={roleConfig.nav}
            onLogout={onLogout}
            activeVariant={roleConfig.activeVariant}
            showMainMenu={roleConfig.showMainMenu !== false}
          />
        </div>

        {/* Mobile sidebar drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label={t('panel.closeMenu')}
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 h-full w-64 pt-0 shadow-xl">
              <PanelSidebar
                items={roleConfig.nav}
                onLogout={onLogout}
                onClose={() => setMobileOpen(false)}
                activeVariant={roleConfig.activeVariant}
                showMainMenu={roleConfig.showMainMenu !== false}
              />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet
            context={{
              userName,
              onLogout,
              role,
              roleConfig,
            }}
          />
        </main>
      </div>
    </div>
  )
}
