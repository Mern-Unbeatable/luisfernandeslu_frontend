function normalizeUrl(value) {
  return String(value ?? '').trim().replace(/\/$/, '')
}

/**
 * Prefer the domain the user is actually on.
 * Live tab → live origin; localhost tab → localhost.
 * VITE_SITE_URL is only a SSR / build-time fallback.
 */
const siteUrl = normalizeUrl(
  (typeof window !== 'undefined' && window.location?.origin) ||
    import.meta.env.VITE_SITE_URL ||
    '',
)

export const env = {
  apiUrl: normalizeUrl(import.meta.env.VITE_BACKEND_URL),
  siteUrl,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
