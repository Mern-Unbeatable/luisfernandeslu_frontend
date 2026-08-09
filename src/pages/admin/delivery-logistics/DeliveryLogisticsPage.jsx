import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Seo from '@/components/common/Seo/Seo'
import DeliveryTimeline from '@/components/data-display/DeliveryTimeline'
import { ADMIN_DELIVERY_ITEMS } from './data/deliveryLogisticsAdminDemo'

const I18N_KEY = 'adminDeliveryLogistics'

export default function DeliveryLogisticsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <Seo
        title={t(`${I18N_KEY}.title`)}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {t(`${I18N_KEY}.title`)}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.subtitle`)}
        </p>
      </div>

      <DeliveryTimeline
        items={ADMIN_DELIVERY_ITEMS}
        onStartTrip={() => {}}
        onMarkPickedUp={() => {}}
        onNavigateToDelivery={() => {}}
        onVerifyDelivery={() => {}}
        onSeeDetails={(item) =>
          navigate(`/admin/delivery-logistics/${item.id}`)
        }
      />
    </div>
  )
}
