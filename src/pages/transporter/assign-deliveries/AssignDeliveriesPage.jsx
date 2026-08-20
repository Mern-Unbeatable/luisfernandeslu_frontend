import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DeliveryTimeline from '../../../components/data-display/DeliveryTimeline'
import AuctionDetails from '../../../components/data-display/AuctionDetails'
import Toast from '../../../components/common/Toast'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import {
  useGetTransporterDeliveryQuery,
  useUpdateTransporterDeliveryStatusMutation,
} from '../../../features/transporter/transporterApi'
import { mapTransporterDeliveryDetails } from '../../../features/transporter/deliveryMappers'
import { useAssignDeliveries } from './AssignDeliveriesContext'

export default function AssignDeliveriesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    deliveries,
    updateDelivery,
    isLoading,
    isError,
    error,
    refetch,
    total,
  } = useAssignDeliveries()
  const [filter, setFilter] = useState('all')
  const [selectedAuctionId, setSelectedAuctionId] = useState(null)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'success',
  })
  const [updateDeliveryStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTransporterDeliveryStatusMutation()

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }))
  }, [])

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useGetTransporterDeliveryQuery(selectedAuctionId, {
    skip: !selectedAuctionId,
  })

  const selectedDelivery = useMemo(() => {
    if (!detailData?.delivery) return null
    return mapTransporterDeliveryDetails(detailData.delivery)
  }, [detailData?.delivery])

  const handleStartTrip = async (item) => {
    const auctionId = item.auctionId || item.id
    if (!auctionId || isUpdatingStatus) return

    updateDelivery(auctionId, { tripStarted: true })

    try {
      await updateDeliveryStatus({
        auctionId,
        action: 'START_TRIP',
      }).unwrap()
      setToast({
        open: true,
        message: t('transporterAssignDeliveries.tripStarted', {
          defaultValue: 'Trip started',
        }),
        variant: 'success',
      })
    } catch (err) {
      updateDelivery(auctionId, { tripStarted: false })
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to start trip'),
        variant: 'error',
      })
    }
  }

  const handleMarkPickedUp = async (item) => {
    const auctionId = item.auctionId || item.id
    if (!auctionId || !item.tripStarted || isUpdatingStatus) return

    const previous = {
      status: item.status,
      tripStarted: item.tripStarted,
    }
    updateDelivery(auctionId, { status: 'picked_up', tripStarted: false })

    try {
      await updateDeliveryStatus({
        auctionId,
        action: 'MARK_PICKED_UP',
      }).unwrap()
      setToast({
        open: true,
        message: t('transporterAssignDeliveries.markedPickedUp', {
          defaultValue: 'Marked picked up',
        }),
        variant: 'success',
      })
    } catch (err) {
      updateDelivery(auctionId, previous)
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to mark picked up'),
        variant: 'error',
      })
    }
  }

  const handleNavigateToDelivery = async (item) => {
    const auctionId = item.auctionId || item.id
    if (!auctionId || isUpdatingStatus) return

    const previous = { status: item.status }
    updateDelivery(auctionId, { status: 'in_transit' })

    try {
      await updateDeliveryStatus({
        auctionId,
        action: 'NAVIGATE_TO_DELIVERY',
      }).unwrap()
      setToast({
        open: true,
        message: t('transporterAssignDeliveries.navigatingToDelivery', {
          defaultValue: 'Navigating to delivery',
        }),
        variant: 'success',
      })
    } catch (err) {
      updateDelivery(auctionId, previous)
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to navigate to delivery'),
        variant: 'error',
      })
    }
  }

  const handleVerifyDeliveryClick = (item) => {
    navigate(`/transporter/assign-deliveries/${item.id}/verify`)
  }

  const handleSeeDetails = (item) => {
    setSelectedAuctionId(item.auctionId || item.id)
  }

  const handleBackFromDetails = () => {
    setSelectedAuctionId(null)
  }

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      if (filter === 'assigned') return d.status === 'assigned'
      if (filter === 'pickedUp') return d.status === 'picked_up'
      if (filter === 'inTransit') return d.status === 'in_transit'
      if (filter === 'delivered') return d.status === 'delivered'
      return true
    })
  }, [deliveries, filter])

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
          status={selectedDelivery.status}
          auction={selectedDelivery}
          onBack={handleBackFromDetails}
          onMessage={() => navigate('/transporter/chat')}
        />
      )
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('transporterAssignDeliveries.title')}
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {t('transporterAssignDeliveries.activeCount', {
              count: filter === 'all' ? total : filteredDeliveries.length,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
            aria-label={t('transporterAssignDeliveries.filterAria')}
          >
            <option value="all">
              {t('transporterAssignDeliveries.filters.all')}
            </option>
            <option value="assigned">
              {t('transporterAssignDeliveries.filters.assigned')}
            </option>
            <option value="pickedUp">
              {t('transporterAssignDeliveries.filters.pickedUp')}
            </option>
            <option value="inTransit">
              {t('transporterAssignDeliveries.filters.inTransit')}
            </option>
            <option value="delivered">
              {t('transporterAssignDeliveries.filters.delivered')}
            </option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading deliveries…</p>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load deliveries')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && filteredDeliveries.length === 0 ? (
        <p className="text-sm text-gray-500">No deliveries found.</p>
      ) : null}

      <DeliveryTimeline
        items={filteredDeliveries}
        onStartTrip={handleStartTrip}
        onMarkPickedUp={handleMarkPickedUp}
        onNavigateToDelivery={handleNavigateToDelivery}
        onVerifyDelivery={handleVerifyDeliveryClick}
        onSeeDetails={handleSeeDetails}
      />
    </div>
  )
}
