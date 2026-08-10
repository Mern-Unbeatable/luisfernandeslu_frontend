import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import AdminDeliveryDetailView from './components/AdminDeliveryDetailView'
import {
  getAdminDeliveryDetail,
  getAdminDeliveryRow,
} from './data/deliveryLogisticsAdminDemo'

const I18N_KEY = 'adminDeliveryLogistics'

export default function DeliveryLogisticsDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deliveryId } = useParams()

  const row = useMemo(
    () => getAdminDeliveryRow(deliveryId ?? ''),
    [deliveryId],
  )
  const delivery = useMemo(
    () => getAdminDeliveryDetail(deliveryId ?? ''),
    [deliveryId],
  )

  if (!row || !delivery) {
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
