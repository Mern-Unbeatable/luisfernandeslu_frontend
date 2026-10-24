import Skeleton from './Skeleton'
import { useTranslation } from 'react-i18next'

/** Panel outlet — coming-soon style card. */
export default function PanelSkeleton() {
  const { t } = useTranslation()
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10"
      role="status"
      aria-busy="true"
      aria-label={t('ui.loading')}
    >
      <span className="sr-only">{t('ui.loading')}</span>
      <div className="mx-auto flex flex-col items-center gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
