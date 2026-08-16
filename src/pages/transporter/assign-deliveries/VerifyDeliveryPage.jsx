import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import VerifyDeliverySection from './sections/VerifyDeliverySection'
import { useAssignDeliveries } from './AssignDeliveriesContext'

export default function VerifyDeliveryPage() {
  const { deliveryId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { deliveries, updateDelivery } = useAssignDeliveries()
  const delivery = deliveries.find((item) => item.id === deliveryId)

  if (!delivery || delivery.status !== 'in_transit') {
    return <Navigate to="/transporter/assign-deliveries" replace />
  }

  const goBack = () => {
    navigate('/transporter/assign-deliveries')
  }

  return (
    <div>
      <button
        type="button"
        onClick={goBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] transition-colors hover:text-[var(--active)]"
      >
        <FiArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        {t('auction.details.back', { defaultValue: 'Back' })}
      </button>

      <VerifyDeliverySection
        delivery={delivery}
        onCancel={goBack}
        onComplete={() => {
          updateDelivery(deliveryId, { status: 'delivered' })
          navigate('/transporter/assign-deliveries')
        }}
      />
    </div>
  )
}
