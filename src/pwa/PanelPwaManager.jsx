import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiDownload, FiX } from 'react-icons/fi'
import {
  canInstallPanelPwa,
  promptInstallPanelPwa,
  syncPanelPwa,
} from './panelPwa'
import { isPanelPwaPath } from './panelPwaConfig'

/**
 * Syncs PWA on/off by route and shows an install banner on panel apps only.
 */
export default function PanelPwaManager() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [installAvailable, setInstallAvailable] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await syncPanelPwa(pathname)
      if (!cancelled) {
        setInstallAvailable(canInstallPanelPwa())
        setDismissed(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [pathname])

  useEffect(() => {
    const onAvailable = () => setInstallAvailable(true)
    const onInstalled = () => {
      setInstallAvailable(false)
      setDismissed(true)
    }
    window.addEventListener('panel-pwa:install-available', onAvailable)
    window.addEventListener('panel-pwa:installed', onInstalled)
    return () => {
      window.removeEventListener('panel-pwa:install-available', onAvailable)
      window.removeEventListener('panel-pwa:installed', onInstalled)
    }
  }, [])

  if (!isPanelPwaPath(pathname) || !installAvailable || dismissed) {
    return null
  }

  return (
    <div className="fixed right-4 bottom-4 z-[60] w-[min(100%-2rem,22rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[var(--active)]">
          <FiDownload className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--primary-text)]">
            {t('pwa.installTitle', 'Install CONSTRUPRECO app')}
          </p>
          <p className="mt-1 text-xs text-[var(--secondary-text)]">
            {t(
              'pwa.installBody',
              'Add this panel to your home screen for faster access.',
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                const result = await promptInstallPanelPwa()
                if (result?.outcome !== 'accepted') {
                  setInstallAvailable(canInstallPanelPwa())
                }
              }}
              className="rounded-lg bg-[var(--active)] px-3 py-1.5 text-xs font-bold text-white uppercase hover:brightness-95"
            >
              {t('pwa.install', 'Install')}
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--secondary-text)] hover:bg-gray-50"
            >
              {t('pwa.notNow', 'Not now')}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t('common.close', 'Close')}
        >
          <FiX className="size-4" />
        </button>
      </div>
    </div>
  )
}
