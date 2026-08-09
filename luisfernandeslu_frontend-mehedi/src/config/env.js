const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const siteUrl = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')
).replace(/\/$/, '')

export const env = {
  apiUrl: apiUrl.replace(/\/$/, ''),
  siteUrl,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
