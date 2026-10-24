import Skeleton from './Skeleton'
import { useTranslation } from 'react-i18next'

/** Public home page content fallback. */
export default function HomeSkeleton() {
  const { t } = useTranslation()
  return (
    <div
      className="container mx-auto w-full space-y-10 px-4 py-10"
      role="status"
      aria-busy="true"
      aria-label={t('ui.loading')}
    >
      <span className="sr-only">{t('ui.loading')}</span>

      <div className="space-y-3">
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <Skeleton className="h-44 w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
