import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CHUNK_RELOAD_KEY = 'construpreco_chunk_reload_at'
const CHUNK_ERROR =
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk/i

/** After a deploy, an open tab can request JS files that no longer exist — reload once to get the new build. */
function shouldReloadForChunkError(error) {
  if (!CHUNK_ERROR.test(String(error?.message || error || ''))) return false
  const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY)) || 0
  return Date.now() - last > 10_000
}

/** Root route `errorElement`: friendly fallback instead of React Router's developer screen. */
export default function RouteErrorPage() {
  const error = useRouteError()
  const { t } = useTranslation()
  const reloadingForChunk = shouldReloadForChunkError(error)

  useEffect(() => {
    if (error) console.error(error)
    if (reloadingForChunk) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
      window.location.reload()
    }
  }, [error, reloadingForChunk])

  if (reloadingForChunk) return null

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F9FAFB] px-4 text-center">
      <img src="/logo.png" alt="CONSTRUPRECO" width={96} height={48} className="h-12 w-auto" />
      <h1 className="text-2xl font-semibold text-[var(--primary-text)]">
        {t('errorPage.title')}
      </h1>
      <p className="max-w-md text-sm text-[var(--secondary-text)] md:text-base">
        {t('errorPage.description')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-[var(--active)] px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-95"
        >
          {t('errorPage.reload')}
        </button>
        <a
          href="/"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
        >
          {t('common.backHome')}
        </a>
      </div>
    </section>
  )
}
