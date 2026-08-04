import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold text-[var(--primary-text)]">404</h1>
      <p className="text-[var(--secondary-text)] text-sm md:text-base">
        {t('seo.notFoundDescription')}
      </p>
      <Link
        to="/"
        className="rounded-md bg-[var(--active)] px-4 py-2 text-sm font-medium text-white hover:brightness-95 transition-colors"
      >
        {t('common.backHome')}
      </Link>
    </section>
  )
}
