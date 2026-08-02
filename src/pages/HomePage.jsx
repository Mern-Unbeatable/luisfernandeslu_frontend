import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-ink-50 flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-500 tracking-tight">
          {t('home.title')}
        </h1>
        <p className="text-ink-300 text-sm md:text-base">
          {t('home.subtitle')}
        </p>
      </div>
    </main>
  )
}
