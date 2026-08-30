import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import BuyerOrderInformation from '@/components/data-display/BuyerOrderInformation/BuyerOrderInformation'
import {
  useDownloadCustomerOrderInvoiceMutation,
  useGetCustomerOrderByIdQuery,
  useGetCustomerOrderTrackQuery,
  useLazyGetCustomerOrderInvoiceQuery,
} from '@/features/customer/customerOrderApi'
import {
  mapCustomerOrderDetail,
  mapCustomerOrderTrack,
} from '@/features/customer/customerOrderMappers'
import { triggerCustomerOrderInvoiceDownload } from '@/features/customer/customerOrderUtils'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import NotFoundPage from '@/pages/public_page/NotFoundPage'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCustomerOrderByIdQuery(orderId ?? '', {
    skip: !orderId,
  })

  const {
    data: trackData,
    isFetching: isTrackFetching,
    refetch: refetchTrack,
  } = useGetCustomerOrderTrackQuery(orderId ?? '', {
    skip: !orderId,
  })

  const [downloadInvoice] = useDownloadCustomerOrderInvoiceMutation()
  const [fetchInvoice] = useLazyGetCustomerOrderInvoiceQuery()

  const order = useMemo(() => {
    const detailOrder = mapCustomerOrderDetail(data)
    const trackOrder = mapCustomerOrderTrack(trackData)

    if (!detailOrder) return null
    if (!trackOrder) return detailOrder

    return {
      ...detailOrder,
      status: trackOrder.status,
      orderStatus: trackOrder.orderStatus,
      shippingAddress: trackOrder.shippingAddress,
      driver: trackOrder.driver,
      progressSteps: trackOrder.progressSteps,
      deliveryOtp: trackOrder.deliveryOtp,
    }
  }, [data, trackData])

  const handleDownloadInvoice = useCallback(async () => {
    if (!order?.id) return

    const success = await triggerCustomerOrderInvoiceDownload({
      orderId: order.id,
      orderNumber: order.orderNumber,
      downloadInvoice,
      fetchInvoice,
      onError: (err) => {
        toast.error(
          getAuthErrorMessage(err, t('buyerOrders.invoiceDownloadFailed')),
        )
      },
    })

    if (success) {
      toast.success(t('buyerOrders.invoiceDownloadSuccess'))
    }
  }, [order, downloadInvoice, fetchInvoice, t])

  if (isLoading && !data) {
    return (
      <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
        {t('buyerOrders.loading')}
      </p>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
        <p className="text-sm text-red-700">
          {error?.data?.message || t('buyerOrders.loadFailed')}
        </p>
        <button
          type="button"
          onClick={() => {
            refetch()
            refetchTrack()
          }}
          className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
        >
          {t('buyerOrders.retry')}
        </button>
      </div>
    )
  }

  if (!order) {
    return <NotFoundPage />
  }

  return (
    <BuyerOrderInformation
      order={order}
      isTracking={isTrackFetching}
      onChatDriver={() => navigate('/messages')}
      onDownloadInvoice={
        order.actions?.canDownloadInvoice ? handleDownloadInvoice : undefined
      }
    />
  )
}
