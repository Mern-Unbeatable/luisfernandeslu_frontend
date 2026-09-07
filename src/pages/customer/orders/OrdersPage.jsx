import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import BuyerOrderCard from '@/components/data-display/BuyerOrderCard/BuyerOrderCard'
import Pagination from '@/components/common/Pagination/Pagination'
import {
  useDownloadCustomerOrderInvoiceMutation,
  useGetCustomerOrdersQuery,
  useLazyGetCustomerOrderInvoiceQuery,
} from '@/features/customer/customerOrderApi'
import { mapCustomerOrder } from '@/features/customer/customerOrderMappers'
import { triggerCustomerOrderInvoiceDownload } from '@/features/customer/customerOrderUtils'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import CancelReasonModal from './components/CancelReasonModal'

const PAGE_SIZE = 20

const STATUS_FILTERS = [
  { id: '', labelKey: 'buyerOrders.filters.all' },
  { id: 'processing', labelKey: 'buyerOrders.filters.processing' },
  { id: 'shipped', labelKey: 'buyerOrders.filters.shipped' },
  { id: 'delivered', labelKey: 'buyerOrders.filters.delivered' },
  { id: 'cancelled', labelKey: 'buyerOrders.filters.cancelled' },
]

export default function OrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [cancelOrder, setCancelOrder] = useState(null)
  const [downloadingOrderId, setDownloadingOrderId] = useState(null)

  const [downloadInvoice] = useDownloadCustomerOrderInvoiceMutation()
  const [fetchInvoice] = useLazyGetCustomerOrderInvoiceQuery()

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetCustomerOrdersQuery({
    page,
    limit: PAGE_SIZE,
    status: statusFilter,
  })

  const orders = useMemo(
    () => (data?.orders ?? []).map(mapCustomerOrder),
    [data?.orders],
  )

  const pagination = data?.pagination
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const showInitialLoading = isLoading && !data

  const handleInvoiceDownload = useCallback(
    async (order) => {
      setDownloadingOrderId(order.id)

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

      setDownloadingOrderId(null)
    },
    [downloadInvoice, fetchInvoice, t],
  )

  const handleOrderAction = (actionId, order) => {
    if (actionId === 'track') {
      navigate(`/customer/orders/${order.id}`)
      return
    }
    if (actionId === 'cancel') {
      setCancelOrder(order)
      return
    }
    if (actionId === 'review') {
      navigate('/customer/product-to-review')
      return
    }
    if (actionId === 'downloadInvoice') {
      handleInvoiceDownload(order)
    }
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = statusFilter === filter.id
          return (
            <button
              key={filter.id || 'all'}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-[var(--active)] text-white'
                  : 'border border-gray-200 bg-white text-[var(--primary-text)] hover:border-[var(--active)]',
              ].join(' ')}
            >
              {t(filter.labelKey)}
            </button>
          )
        })}
      </div>

      {showInitialLoading ? (
        <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
          {t('buyerOrders.loading')}
        </p>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
          <p className="text-sm text-red-700">
            {error?.data?.message || t('buyerOrders.loadFailed')}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
          >
            {t('buyerOrders.retry')}
          </button>
        </div>
      ) : orders.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
          {t('buyerOrders.empty')}
        </p>
      ) : (
        <ul
          className={[
            'flex flex-col gap-4 sm:gap-5',
            isFetching || downloadingOrderId ? 'opacity-60' : '',
          ].join(' ')}
        >
          {orders.map((order) => (
            <li key={order.id}>
              <BuyerOrderCard order={order} onAction={handleOrderAction} />
            </li>
          ))}
        </ul>
      )}

      {!showInitialLoading && !isError && orders.length > 0 ? (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}

      <CancelReasonModal
        open={Boolean(cancelOrder)}
        order={cancelOrder}
        onClose={() => setCancelOrder(null)}
        onCancelled={() => setCancelOrder(null)}
      />
    </div>
  )
}
