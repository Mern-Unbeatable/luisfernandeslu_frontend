import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import DisputesCenter from '@/components/data-display/DisputesCenter/DisputesCenter'
import {
  useCreateCustomerDisputeMutation,
  useGetCustomerDisputeOrdersQuery,
  useGetCustomerDisputesQuery,
} from '@/features/customer/customerDisputeApi'
import {
  mapCustomerDispute,
  mapCustomerDisputeOrderOption,
  mapCustomerDisputeStats,
} from '@/features/customer/customerDisputeMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

export default function DisputesListPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    data: disputesData,
    isLoading: disputesLoading,
    isError: disputesError,
    error: disputesErrorData,
    isFetching: disputesFetching,
    refetch: refetchDisputes,
  } = useGetCustomerDisputesQuery()

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorData,
    isFetching: ordersFetching,
    refetch: refetchOrders,
  } = useGetCustomerDisputeOrdersQuery()

  const [createDispute, { isLoading: isSubmitting }] =
    useCreateCustomerDisputeMutation()

  const stats = useMemo(
    () => mapCustomerDisputeStats(disputesData?.stats),
    [disputesData?.stats],
  )

  const disputes = useMemo(
    () => (disputesData?.disputes ?? []).map(mapCustomerDispute),
    [disputesData?.disputes],
  )

  const orderOptions = useMemo(
    () => (ordersData?.orders ?? []).map(mapCustomerDisputeOrderOption),
    [ordersData?.orders],
  )

  const handleCreateDispute = async ({
    orderNumber,
    itemIds,
    issueType,
    description,
    evidence,
  }) => {
    if (!evidence.length) {
      toast.error(t('disputesCenter.modal.evidenceRequired'))
      throw new Error('evidence required')
    }

    try {
      const result = await createDispute({
        orderNumber,
        itemIds,
        issueType,
        description,
        evidence,
      }).unwrap()

      if (result?.success === false) {
        toast.error(
          getAuthErrorMessage(result, t('disputesCenter.submitFailed')),
        )
        throw new Error('submit failed')
      }

      toast.success(result?.message || t('disputesCenter.submitSuccess'))

      const disputeId =
        result?.dispute?.id
        ?? result?.id

      if (disputeId) {
        navigate(`/dispute-resolution/${disputeId}`)
        return
      }
    } catch (err) {
      if (
        err?.message === 'evidence required'
        || err?.message === 'submit failed'
      ) {
        throw err
      }
      toast.error(getAuthErrorMessage(err, t('disputesCenter.submitFailed')))
      throw err
    }
  }

  const showInitialLoading =
    (disputesLoading && !disputesData) || (ordersLoading && !ordersData)
  const hasError = disputesError || ordersError
  const errorMessage =
    disputesErrorData?.data?.message
    || ordersErrorData?.data?.message
    || t('disputesCenter.loadFailed')

  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showInitialLoading ? (
          <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('disputesCenter.loading')}
          </p>
        ) : hasError ? (
          <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                refetchDisputes()
                refetchOrders()
              }}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('disputesCenter.retry')}
            </button>
          </div>
        ) : (
          <DisputesCenter
            stats={stats}
            disputes={disputes}
            orderOptions={orderOptions}
            isFetching={disputesFetching || ordersFetching}
            isSubmitting={isSubmitting}
            onOpenDispute={(row) => navigate(`/dispute-resolution/${row.id}`)}
            onCreateDispute={handleCreateDispute}
          />
        )}
      </div>
    </div>
  )
}
