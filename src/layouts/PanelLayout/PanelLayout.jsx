import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../../components/common/Seo/Seo'
import PanelSidebar from './PanelSidebar'
import PanelHeader from './PanelHeader'
import { getPanelRoleConfig } from '../../roles'

/**
 * PanelLayout — full-width header + sidebar below (separate).
 * Mobile drawer slides left → right with smooth open/close.
 */
export default function PanelLayout({
  role = 'supplier',
  userName = 'Atik Adnan',
  onLogout,
  isLoggingOut = false,
}) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const roleConfig = getPanelRoleConfig(role)

  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

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
            isLoggingOut={isLoggingOut}
            showMainMenu={roleConfig.showMainMenu !== false}
          />
        </div>

        {/* Mobile drawer — always mounted so close can animate */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            tabIndex={mobileOpen ? 0 : -1}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label={t('panel.closeMenu')}
            onClick={closeMobile}
          />
          <div
            className={`absolute top-0 left-0 h-full w-[80%] max-w-xs shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <PanelSidebar
              items={roleConfig.nav}
              onLogout={() => {
                closeMobile()
                onLogout?.()
              }}
              isLoggingOut={isLoggingOut}
              onClose={closeMobile}
              showMainMenu={roleConfig.showMainMenu !== false}
              className="h-full"
            />
          </div>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet
            context={{
              userName,
              onLogout,
              isLoggingOut,
              role,
              roleConfig,
            }}
          />
        </main>
      </div>
    </div>
  )
}
