import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiTruck } from 'react-icons/fi'
import { useGetSupplierDeliveriesQuery } from '@/features/supplier/deliveries/deliveriesApi'

const LOGISTICS_PATH = '/supplier/delivery-logistics'

export default function SupplierDeliveryAlert() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { data } = useGetSupplierDeliveriesQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
  })
  const count = data?.pending?.length || 0

  if (!count || pathname.startsWith(LOGISTICS_PATH)) return null

  return (
    <div
      role="alert"
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <FiTruck className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
        <div>
          <p className="text-sm font-bold text-amber-900">
            {t('supplierDeliveryLogistics.alert.title', { count })}
          </p>
          <p className="mt-0.5 text-sm text-amber-800">
            {t('supplierDeliveryLogistics.alert.body')}
          </p>
        </div>
      </div>
      <Link
        to={LOGISTICS_PATH}
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--active)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95"
      >
        {t('supplierDeliveryLogistics.alert.cta')}
      </Link>
    </div>
  )
}
