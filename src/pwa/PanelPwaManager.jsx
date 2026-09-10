import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiDownload, FiX } from 'react-icons/fi'
import {
  canInstallPanelPwa,
  promptInstallPanelPwa,
  syncPanelPwa,
} from './panelPwa'
import {
  getPanelBasePath,
  isPanelPwaAuthPath,
  isPanelPwaPath,
} from './panelPwaConfig'

const DISMISS_STORAGE_PREFIX = 'pwa-install-dismissed'
const OFFERED_STORAGE_PREFIX = 'pwa-install-offered-panel'
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000

function dismissStorageKey(basePath) {
  return `${DISMISS_STORAGE_PREFIX}:${basePath}`
}

function offeredStorageKey(basePath) {
  return `${OFFERED_STORAGE_PREFIX}:${basePath}`
}

function readDismissed(basePath) {
  try {
    const raw = localStorage.getItem(dismissStorageKey(basePath))
    if (!raw) return false
    const parsed = JSON.parse(raw)
    if (!parsed?.at) return false
    if (Date.now() - Number(parsed.at) > DISMISS_TTL_MS) {
      localStorage.removeItem(dismissStorageKey(basePath))
      return false
    }
    return true
  } catch {
    return false
  }
}

function writeDismissed(basePath) {
  try {
    localStorage.setItem(
      dismissStorageKey(basePath),
      JSON.stringify({ at: Date.now() }),
    )
  } catch {
    /* ignore quota / private mode */
  }
}

function readOfferedThisSession(basePath) {
  try {
    return sessionStorage.getItem(offeredStorageKey(basePath)) === '1'
  } catch {
    return false
  }
}

function writeOfferedThisSession(basePath) {
  try {
    sessionStorage.setItem(offeredStorageKey(basePath), '1')
  } catch {
    /* ignore */
  }
}

/**
 * Syncs PWA on/off by route.
 * Install banner: login/register for PWA roles, plus once after login
 * on the panel — not on every in-app page change.
 */
export default function PanelPwaManager() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [installAvailable, setInstallAvailable] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const basePath = getPanelBasePath(pathname)
  const isAuthPath = isPanelPwaAuthPath(pathname)
  const isPanelPath = isPanelPwaPath(pathname)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await syncPanelPwa(pathname)
      if (cancelled) return
      setInstallAvailable(canInstallPanelPwa())
      setDismissed(readDismissed(getPanelBasePath(pathname)))
    })()
    return () => {
      cancelled = true
    }
  }, [pathname])

  useEffect(() => {
    const onAvailable = () => {
      setInstallAvailable(true)
      setDismissed(readDismissed(getPanelBasePath(window.location.pathname)))
    }
    const onInstalled = () => {
      setInstallAvailable(false)
      setDismissed(true)
      writeDismissed(getPanelBasePath(window.location.pathname))
    }
    window.addEventListener('panel-pwa:install-available', onAvailable)
    window.addEventListener('panel-pwa:installed', onInstalled)
    return () => {
      window.removeEventListener('panel-pwa:install-available', onAvailable)
      window.removeEventListener('panel-pwa:installed', onInstalled)
    }
  }, [])

  const mayOfferOnThisRoute =
    isPanelPath &&
    !dismissed &&
    installAvailable &&
    (isAuthPath || !readOfferedThisSession(basePath))

  useEffect(() => {
    if (!mayOfferOnThisRoute || isAuthPath) return
    // Mark panel offer once so later /admin/* navigations stay quiet.
    writeOfferedThisSession(basePath)
  }, [mayOfferOnThisRoute, isAuthPath, basePath])

  const dismiss = () => {
    setDismissed(true)
    writeDismissed(basePath)
    writeOfferedThisSession(basePath)
  }

  if (!mayOfferOnThisRoute) {
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
                if (result?.outcome === 'accepted') {
                  dismiss()
                  return
                }
                setInstallAvailable(canInstallPanelPwa())
                if (!canInstallPanelPwa()) dismiss()
              }}
              className="rounded-lg bg-[var(--active)] px-3 py-1.5 text-xs font-bold text-white uppercase hover:brightness-95"
            >
              {t('pwa.install', 'Install')}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--secondary-text)] hover:bg-gray-50"
            >
              {t('pwa.notNow', 'Not now')}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t('common.close', 'Close')}
        >
          <FiX className="size-4" />
        </button>
      </div>
    </div>
  )
}
