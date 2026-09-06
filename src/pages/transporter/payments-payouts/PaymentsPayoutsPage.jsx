import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from '../../../components/common/Toast'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import {
  useGetTransporterPaymentsPayoutsQuery,
  useRequestTransporterWithdrawalMutation,
} from '../../../features/transporter/transporterApi'
import { mapPaymentsPayoutsResponse } from '../../../features/transporter/paymentMappers'
import StatsSection from './sections/StatsSection'
import RevenueSection from './sections/RevenueSection'
import HistorySection from './sections/HistorySection'
import Skeleton from '../../../components/common/Skeleton/Skeleton'

const HISTORY_PAGE_SIZE = 7

export default function PaymentsPayoutsPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('thisYear')
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'success',
  })

  const { data, isLoading, isError, error, refetch } =
    useGetTransporterPaymentsPayoutsQuery({
      period,
      page,
      limit: HISTORY_PAGE_SIZE,
    })
  const [requestWithdrawal, { isLoading: isWithdrawing }] =
    useRequestTransporterWithdrawalMutation()

  const mapped = useMemo(() => mapPaymentsPayoutsResponse(data), [data])
  const totalPages = Math.max(1, Number(mapped.pagination?.totalPages) || 1)

  useEffect(() => {
    setPage(1)
  }, [period])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }))
  }, [])

  const handleWithdraw = async (payload) => {
    try {
      await requestWithdrawal(payload).unwrap()
      setToast({
        open: true,
        message: t('transporterPaymentsPayouts.withdraw.success', {
          defaultValue: 'Withdrawal request submitted',
        }),
        variant: 'success',
      })
      return true
    } catch (err) {
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to submit withdrawal'),
        variant: 'error',
      })
      return false
    }
  }

  return (
    <div className="space-y-6">
      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={closeToast}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('transporterPaymentsPayouts.title')}
        </h1>
        <p className="mt-1 text-base text-gray-500">
          {t('transporterPaymentsPayouts.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8" role="status" aria-busy="true" aria-label="Loading">
          <span className="sr-only">Loading</span>
          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`stat-skel-${i}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>

          {/* Revenue Chart Card Skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>

          {/* History Table Skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-36" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`table-skel-${i}`} className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load payments')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <StatsSection
            stats={mapped.stats}
            onWithdraw={handleWithdraw}
            isWithdrawing={isWithdrawing}
          />
          <RevenueSection
            revenue={mapped.revenue}
            period={period}
            onPeriodChange={setPeriod}
          />
          <HistorySection
            rows={mapped.history}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
