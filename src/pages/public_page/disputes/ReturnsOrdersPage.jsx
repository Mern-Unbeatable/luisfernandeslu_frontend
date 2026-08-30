import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import ReturnsOrdersCenter from '@/components/data-display/ReturnsOrdersCenter/ReturnsOrdersCenter'
import {
  useGetCustomerReturnOrdersQuery,
  useGetCustomerReturnRequestsQuery,
} from '@/features/customer/customerReturnApi'
import {
  mapCustomerReturnOrder,
  mapCustomerReturnRequest,
} from '@/features/customer/customerReturnMappers'

export default function ReturnsOrdersPage() {
  const { t } = useTranslation()

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorData,
    isFetching: ordersFetching,
    refetch: refetchOrders,
  } = useGetCustomerReturnOrdersQuery()

  const {
    data: returnsData,
    isLoading: returnsLoading,
    isError: returnsError,
    error: returnsErrorData,
    isFetching: returnsFetching,
    refetch: refetchReturns,
  } = useGetCustomerReturnRequestsQuery()

  const orders = useMemo(
    () => (ordersData?.orders ?? []).map(mapCustomerReturnOrder),
    [ordersData?.orders],
  )

  const returns = useMemo(
    () => (returnsData?.returns ?? []).map(mapCustomerReturnRequest),
    [returnsData?.returns],
  )

  const showInitialLoading =
    (ordersLoading && !ordersData) || (returnsLoading && !returnsData)
  const hasError = ordersError || returnsError
  const errorMessage =
    ordersErrorData?.data?.message
    || returnsErrorData?.data?.message
    || t('returnsCenter.loadFailed')

  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showInitialLoading ? (
          <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('returnsCenter.loading')}
          </p>
        ) : hasError ? (
          <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                refetchOrders()
                refetchReturns()
              }}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('returnsCenter.retry')}
            </button>
          </div>
        ) : (
          <ReturnsOrdersCenter
            orders={orders}
            returns={returns}
            isFetching={ordersFetching || returnsFetching}
          />
        )}
      </div>
    </div>
  )
}
