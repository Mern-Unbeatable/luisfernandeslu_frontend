import Skeleton from '@/components/common/Skeleton/Skeleton'
import TableSkeleton from '@/components/common/Skeleton/TableSkeleton'
import { useTranslation } from 'react-i18next'

/** Matches factory invoices list: header + data table. */
export default function FactoryInvoicesPageSkeleton() {
  const { t } = useTranslation()
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label={t('ui.loading')}
    >
      <span className="sr-only">{t('ui.loading')}</span>

      <div className="space-y-2">
        <Skeleton className="h-8 w-44 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <TableSkeleton />
    </div>
  )
}
