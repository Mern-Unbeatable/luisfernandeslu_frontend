import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DeliveryTimeline from '../../../components/data-display/DeliveryTimeline'
import AuctionDetails from '../../../components/data-display/AuctionDetails'
import Pagination from '../../../components/common/Pagination/Pagination'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import {
  useGetTransporterCompletedDeliveriesQuery,
  useGetTransporterDeliveryQuery,
} from '../../../features/transporter/transporterApi'
import {
  mapTransporterDelivery,
  mapTransporterDeliveryDetails,
} from '../../../features/transporter/deliveryMappers'

const PAGE_SIZE = 20

export default function OrderHistoryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [selectedAuctionId, setSelectedAuctionId] = useState(null)

  const { data, isLoading, isError, error, refetch } =
    useGetTransporterCompletedDeliveriesQuery({
      page,
      limit: PAGE_SIZE,
    })

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useGetTransporterDeliveryQuery(selectedAuctionId, {
    skip: !selectedAuctionId,
  })

  const completedDeliveries = useMemo(
    () => (data?.deliveries || []).map(mapTransporterDelivery),
    [data?.deliveries],
  )

  const selectedDelivery = useMemo(() => {
    if (!detailData?.delivery) return null
    return mapTransporterDeliveryDetails(detailData.delivery)
  }, [detailData?.delivery])

  const totalPages = Math.max(1, Number(data?.pagination?.totalPages) || 1)
  const totalCount = Number(data?.pagination?.total) || completedDeliveries.length

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleSeeDetails = (item) => {
    setSelectedAuctionId(item.auctionId || item.id)
  }

  const handleBackFromDetails = () => {
    setSelectedAuctionId(null)
  }

  if (selectedAuctionId) {
    if (isDetailLoading) {
      return <p className="text-sm text-gray-500">Loading delivery details…</p>
    }

    if (isDetailError) {
      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleBackFromDetails}
            className="text-sm font-semibold text-[var(--active)] underline"
          >
            Back
          </button>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>
              {getAuthErrorMessage(detailError, 'Failed to load delivery details')}
            </p>
            <button
              type="button"
              onClick={() => refetchDetail()}
              className="mt-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    if (selectedDelivery) {
      return (
        <AuctionDetails
          role="transporter"
          status="complete"
          auction={selectedDelivery}
          onBack={handleBackFromDetails}
          onMessage={() => navigate('/transporter/chat')}
        />
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('transporterOrderHistory.title')}
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {t('transporterOrderHistory.completedCount', {
              count: totalCount,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value="delivered"
            disabled
            className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-400 outline-none"
            aria-label={t('transporterOrderHistory.filterAria')}
          >
            <option value="delivered">
              {t('transporterOrderHistory.filters.delivered')}
            </option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading completed deliveries…</p>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load delivery history')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && completedDeliveries.length === 0 ? (
        <p className="text-sm text-gray-500">No completed deliveries found.</p>
      ) : null}

      <DeliveryTimeline
        items={completedDeliveries}
        onSeeDetails={handleSeeDetails}
      />

      {totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : null}
    </div>
  )
}
