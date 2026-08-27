import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import Toast from '../../../components/common/Toast'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import {
  useGetTransporterDeliveryQuery,
  useUpdateTransporterDeliveryStatusMutation,
  useVerifyTransporterDeliveryOtpMutation,
} from '../../../features/transporter/transporterApi'
import {
  mapTransporterDeliveryDetails,
  normalizeDeliveryStatus,
} from '../../../features/transporter/deliveryMappers'
import VerifyDeliverySection from './sections/VerifyDeliverySection'
import { useAssignDeliveries } from './AssignDeliveriesContext'

export default function VerifyDeliveryPage() {
  const { deliveryId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { deliveries, updateDelivery } = useAssignDeliveries()
  const otpSendAttempted = useRef(false)

  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'success',
  })

  const listDelivery = deliveries.find((item) => item.id === deliveryId)

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useGetTransporterDeliveryQuery(deliveryId, {
    skip: !deliveryId,
  })

  const [sendDeliveryOtp, { isLoading: isSendingOtp }] =
    useUpdateTransporterDeliveryStatusMutation()
  const [verifyOtp, { isLoading: isVerifying }] =
    useVerifyTransporterDeliveryOtpMutation()

  const detail = useMemo(() => {
    if (!detailData?.delivery) return null
    return mapTransporterDeliveryDetails(detailData.delivery)
  }, [detailData?.delivery])

  const otpSent = Boolean(
    detailData?.delivery?.actions?.otpSent || listDelivery?.actions?.otpSent,
  )

  const status = detail?.status || listDelivery?.status
  const normalizedStatus = normalizeDeliveryStatus(status)

  const summaryDelivery = useMemo(() => {
    if (detail) {
      return {
        id: detail.auctionId,
        auctionId: detail.auctionId,
        orderId: detail.orderId,
        title: detail.product?.name || '—',
        orderLabel: detail.orderId
          ? `Order ID: ${detail.orderId}`
          : `Auction ID: ${detail.auctionId || '—'}`,
        price: detail.deliveryCharge || '—',
        quantity: detail.quantity || detail.product?.quantity || '—',
        customerName: detail.customer?.name || '—',
        status: detail.status,
      }
    }
    if (!listDelivery) return null
    return {
      id: listDelivery.id,
      auctionId: listDelivery.auctionId || listDelivery.id,
      orderId: listDelivery.orderId,
      title: listDelivery.title,
      orderLabel: listDelivery.orderLabel,
      price: listDelivery.price,
      quantity: '—',
      customerName:
        listDelivery.delivery?.title ||
        listDelivery.deliveryLocation ||
        '—',
      status: listDelivery.status,
    }
  }, [detail, listDelivery])

  useEffect(() => {
    if (!deliveryId || !detailData?.delivery || otpSendAttempted.current) return
    if (normalizedStatus !== 'in_transit') return
    if (detailData.delivery.actions?.otpSent) return

    otpSendAttempted.current = true
    sendDeliveryOtp({
      auctionId: deliveryId,
      action: 'VERIFY_DELIVERY',
    })
      .unwrap()
      .then(() => {
        setToast({
          open: true,
          message: t('transporterAssignDeliveries.otpSent', {
            defaultValue: 'Delivery OTP sent to customer',
          }),
          variant: 'success',
        })
        refetchDetail()
      })
      .catch((err) => {
        otpSendAttempted.current = false
        setToast({
          open: true,
          message: getAuthErrorMessage(err, 'Failed to send delivery OTP'),
          variant: 'error',
        })
      })
  }, [
    deliveryId,
    detailData?.delivery,
    normalizedStatus,
    sendDeliveryOtp,
    refetchDetail,
    t,
  ])

  if (!deliveryId) {
    return <Navigate to="/transporter/assign-deliveries" replace />
  }

  if (isDetailLoading && !listDelivery) {
    return <p className="text-sm text-gray-500">Loading delivery…</p>
  }

  if (isDetailError && !listDelivery) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p>{getAuthErrorMessage(detailError, 'Failed to load delivery')}</p>
        <button
          type="button"
          onClick={() => refetchDetail()}
          className="mt-2 font-semibold underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!summaryDelivery || normalizedStatus !== 'in_transit') {
    return <Navigate to="/transporter/assign-deliveries" replace />
  }

  const goBack = () => {
    navigate('/transporter/assign-deliveries')
  }

  const handleComplete = async ({ otp, proofFile }) => {
    const auctionId = summaryDelivery.auctionId || deliveryId
    if (!auctionId || isVerifying) return false

    const pin = String(otp || '').trim()
    if (!/^\d{4}$/.test(pin)) {
      setToast({
        open: true,
        message: t('transporterAssignDeliveries.invalidOtp', {
          defaultValue: 'Enter the 4-digit customer PIN',
        }),
        variant: 'error',
      })
      return false
    }

    try {
      await verifyOtp({
        auctionId,
        otp: pin,
        proofFiles: proofFile ? [proofFile] : [],
      }).unwrap()
      updateDelivery(auctionId, { status: 'delivered' })
      setToast({
        open: true,
        message: t('transporterAssignDeliveries.deliveryVerified', {
          defaultValue: 'Delivery verified',
        }),
        variant: 'success',
      })
      navigate('/transporter/assign-deliveries')
      return true
    } catch (err) {
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to verify delivery'),
        variant: 'error',
      })
      return false
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

      {isSendingOtp && !otpSent ? (
        <p className="mb-4 text-sm text-gray-500">Sending OTP to customer…</p>
      ) : null}

      <VerifyDeliverySection
        delivery={summaryDelivery}
        onCancel={goBack}
        onComplete={handleComplete}
        isSubmitting={isVerifying}
      />
    </div>
  )
}
