import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import { useGetAdminLogisticsByIdQuery } from '@/features/admin/adminLogisticsApi'
import { mapAdminLogisticsDetail } from '@/features/admin/adminLogisticsMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import AdminDeliveryDetailView from './components/AdminDeliveryDetailView'

const I18N_KEY = 'adminDeliveryLogistics'

export default function DeliveryLogisticsDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deliveryId } = useParams()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminLogisticsByIdQuery(deliveryId ?? '', {
    skip: !deliveryId,
  })

  const delivery = useMemo(
    () => mapAdminLogisticsDetail(data?.delivery),
    [data?.delivery],
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.loading`)} />
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.detail.loading`)}
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.loadFailed`)} />
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.detail.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
        <Link
          to="/admin/delivery-logistics"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N_KEY}.detail.back`)}
        </Link>
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.notFound`)} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.detail.notFound`)}
        </p>
        <Link
          to="/admin/delivery-logistics"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N_KEY}.detail.back`)}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Seo
        title={t(`${I18N_KEY}.detail.title`, { id: delivery.auctionId })}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <AdminDeliveryDetailView
        delivery={delivery}
        onBack={() => navigate('/admin/delivery-logistics')}
      />
    </div>
  )
}
