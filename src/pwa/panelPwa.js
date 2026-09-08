import {
  getPanelBasePath,
  isPanelPwaPath,
} from './panelPwaConfig'

const MANIFEST_LINK_ID = 'panel-pwa-manifest'
const APPLE_META_ID = 'panel-pwa-apple-mobile'

let deferredInstallPrompt = null
let swRegistration = null
let listenersBound = false

function ensureInstallListeners() {
  if (listenersBound || typeof window === 'undefined') return
  listenersBound = true

  // Do NOT call preventDefault — keeps Chrome address-bar install icon visible.
  window.addEventListener('beforeinstallprompt', (event) => {
    if (!isPanelPwaPath(window.location.pathname)) return
    deferredInstallPrompt = event
    window.dispatchEvent(new CustomEvent('panel-pwa:install-available'))
  })

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null
    window.dispatchEvent(new CustomEvent('panel-pwa:installed'))
  })
}

function setAppleMeta(enabled) {
  let meta = document.getElementById(APPLE_META_ID)
  if (!enabled) {
    meta?.remove()
    return
  }
  if (!meta) {
    meta = document.createElement('meta')
    meta.id = APPLE_META_ID
    meta.name = 'apple-mobile-web-app-capable'
    document.head.appendChild(meta)
  }
  meta.content = 'yes'
}

function manifestHrefForPath(pathname) {
  const basePath = getPanelBasePath(pathname)
  const role = basePath.replace(/^\//, '')
  return `/manifests/${role}.webmanifest`
}

function applyManifest(pathname) {
  let link = document.getElementById(MANIFEST_LINK_ID)
  if (!link) {
    link = document.createElement('link')
    link.id = MANIFEST_LINK_ID
    link.rel = 'manifest'
    document.head.appendChild(link)
  }
  const nextHref = manifestHrefForPath(pathname)
  if (link.getAttribute('href') !== nextHref) {
    link.setAttribute('href', nextHref)
  }
}

function removeManifest() {
  document.getElementById(MANIFEST_LINK_ID)?.remove()
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null
  try {
    const isDev = import.meta.env.DEV
    const swUrl = isDev ? '/dev-sw.js?dev-sw' : '/sw.js'
    swRegistration = await navigator.serviceWorker.register(swUrl, {
      scope: '/',
      type: isDev ? 'module' : 'classic',
      updateViaCache: 'none',
    })
    await navigator.serviceWorker.ready
    return swRegistration
  } catch (error) {
    console.warn('[PWA] Service worker registration failed:', error)
    return null
  }
}

export async function unregisterPanelServiceWorkers() {
  if (!('serviceWorker' in navigator)) return
  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map((reg) => reg.unregister()))
  swRegistration = null

  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }
}

/**
 * Enable panel PWA (static manifest + SW) on panel routes.
 * Buyer/public routes stay a normal website: no manifest / install UI.
 */
export async function syncPanelPwa(pathname = window.location.pathname) {
  ensureInstallListeners()

  if (isPanelPwaPath(pathname)) {
    applyManifest(pathname)
    setAppleMeta(true)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', '#DF900A')
    await registerServiceWorker()
    return
  }

  removeManifest()
  setAppleMeta(false)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', '#18181b')
  deferredInstallPrompt = null
}

export function canInstallPanelPwa() {
  return Boolean(deferredInstallPrompt)
}

export async function promptInstallPanelPwa() {
  if (!deferredInstallPrompt) return { outcome: 'unavailable' }
  const promptEvent = deferredInstallPrompt
  deferredInstallPrompt = null
  await promptEvent.prompt()
  const choice = await promptEvent.userChoice
  return choice
}

export function getDeferredInstallPrompt() {
  return deferredInstallPrompt
}
