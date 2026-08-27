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
        <p className="text-sm text-gray-500">Loading payments…</p>
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
