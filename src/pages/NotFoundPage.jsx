import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold text-ink-500">404</h1>
      <p className="text-ink-300 text-sm md:text-base">
        {t('seo.notFoundDescription')}
      </p>
      <Link
        to="/"
        className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
      >
        {t('common.backHome')}
      </Link>
    </section>
  )
}
