import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import Seo from '@/components/common/Seo/Seo'
import ReturnOrderDetailView from '@/components/data-display/ReturnsOrdersCenter/ReturnOrderDetailView'
import ReturnsCenterToolbar from '@/components/data-display/ReturnsOrdersCenter/ReturnsCenterToolbar'
import RequestReturnModal from '@/components/data-display/ReturnsOrdersCenter/RequestReturnModal'
import {
  useCreateCustomerReturnRequestMutation,
  useGetCustomerReturnOrderByIdQuery,
} from '@/features/customer/customerReturnApi'
import { mapCustomerReturnOrderDetail } from '@/features/customer/customerReturnMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

export default function ReturnOrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCustomerReturnOrderByIdQuery(orderId ?? '', {
    skip: !orderId,
  })

  const [createReturnRequest, { isLoading: isSubmitting }] =
    useCreateCustomerReturnRequestMutation()

  const order = useMemo(() => mapCustomerReturnOrderDetail(data), [data])

  const openModal = (item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleSubmit = async ({
    item,
    reason,
    description,
    damagedCount,
    refundAccount,
    evidence,
  }) => {
    if (!order?.id || !item?.id) return

    if (!evidence.length) {
      toast.error(t('returnsCenter.modal.evidenceRequired'))
      throw new Error('evidence required')
    }

    try {
      const result = await createReturnRequest({
        orderId: order.id,
        itemId: item.id,
        reason,
        description,
        damagedCount,
        refundAccount,
        evidence,
      }).unwrap()

      if (result?.success === false) {
        toast.error(
          getAuthErrorMessage(result, t('returnsCenter.submitFailed')),
        )
        throw new Error('submit failed')
      }

      toast.success(result?.message || t('returnsCenter.submitSuccess'))

      const returnRequestId =
        result?.return?.id
        ?? result?.request?.id
        ?? result?.id

      setModalOpen(false)
      setSelectedItem(null)

      if (returnRequestId) {
        navigate(`/returns/request/${returnRequestId}`)
        return
      }

      navigate('/returns?tab=return')
    } catch (err) {
      if (
        err?.message === 'evidence required'
        || err?.message === 'submit failed'
      ) {
        throw err
      }
      toast.error(getAuthErrorMessage(err, t('returnsCenter.submitFailed')))
      throw err
    }
  }

  if (isLoading && !data) {
    return (
      <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
        <Seo />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('returnsCenter.loading')}
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
        <Seo />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">
              {error?.data?.message || t('returnsCenter.loadFailed')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('returnsCenter.retry')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return <NotFoundPage />
  }

  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ReturnOrderDetailView
          order={order}
          onReturnRefund={openModal}
          toolbar={
            <ReturnsCenterToolbar
              tab="orders"
              onTabChange={(next) => {
                if (next === 'return') navigate('/returns?tab=return')
                else navigate('/returns')
              }}
              query={query}
              onQueryChange={setQuery}
            />
          }
        />
        <RequestReturnModal
          open={modalOpen}
          onClose={() => {
            if (!isSubmitting) {
              setModalOpen(false)
              setSelectedItem(null)
            }
          }}
          item={selectedItem}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
