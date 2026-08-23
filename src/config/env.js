function normalizeUrl(value) {
  return String(value ?? '').trim().replace(/\/$/, '')
}

const siteUrl = normalizeUrl(
  import.meta.env.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : ''),
)

export const env = {
  apiUrl: normalizeUrl(import.meta.env.VITE_BACKEND_URL),
  siteUrl,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
