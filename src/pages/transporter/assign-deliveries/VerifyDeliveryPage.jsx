import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import Toast from '../../../components/common/Toast'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import { useUpdateTransporterDeliveryStatusMutation } from '../../../features/transporter/transporterApi'
import VerifyDeliverySection from './sections/VerifyDeliverySection'
import { useAssignDeliveries } from './AssignDeliveriesContext'

export default function VerifyDeliveryPage() {
  const { deliveryId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { deliveries, updateDelivery } = useAssignDeliveries()
  const [updateDeliveryStatus, { isLoading: isVerifying }] =
    useUpdateTransporterDeliveryStatusMutation()
  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'error',
  })
  const delivery = deliveries.find((item) => item.id === deliveryId)

  if (!delivery || delivery.status !== 'in_transit') {
    return <Navigate to="/transporter/assign-deliveries" replace />
  }

  const goBack = () => {
    navigate('/transporter/assign-deliveries')
  }

  const handleComplete = async () => {
    const auctionId = delivery.auctionId || delivery.id || deliveryId
    if (!auctionId || isVerifying) return

    try {
      await updateDeliveryStatus({
        auctionId,
        action: 'VERIFY_DELIVERY',
      }).unwrap()
      updateDelivery(auctionId, { status: 'delivered' })
      navigate('/transporter/assign-deliveries')
    } catch (err) {
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to verify delivery'),
        variant: 'error',
      })
    }
  }

  return (
    <div>
      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

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
        onComplete={handleComplete}
        isSubmitting={isVerifying}
      />
    </div>
  )
}
