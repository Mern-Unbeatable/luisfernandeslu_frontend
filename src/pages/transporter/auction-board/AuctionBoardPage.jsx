import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AuctionCard from '../../../components/data-display/AuctionCard'
import AuctionDetails from '../../../components/data-display/AuctionDetails'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import {
  useGetTransporterAuctionsQuery,
  usePlaceTransporterBidMutation,
} from '../../../features/transporter/transporterApi'
import {
  applyClientAuctionFilter,
  getApiFilterParam,
  mapTransporterAuction,
} from '../../../features/transporter/auctionMappers'

export default function AuctionBoardPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const [bidError, setBidError] = useState('')

  const apiFilter = getApiFilterParam(filter)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTransporterAuctionsQuery({
    page: 1,
    limit: 20,
    filter: apiFilter,
  })
  const [placeBid, { isLoading: isBidding }] = usePlaceTransporterBidMutation()

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const auctions = useMemo(() => {
    void now
    return (data?.auctions || []).map(mapTransporterAuction)
  }, [data?.auctions, now])

  const filteredAuctions = useMemo(
    () => applyClientAuctionFilter(auctions, filter),
    [auctions, filter],
  )

  const handlePlaceBid = async (bidAmount, auction) => {
    if (!auction?.canBid || !auction?.auctionId || isBidding) return

    const amount = Number(bidAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setBidError('Enter a valid bid amount')
      return
    }

    setBidError('')

    try {
      await placeBid({
        auctionId: auction.auctionId,
        bidAmount: amount,
      }).unwrap()
    } catch (err) {
      setBidError(getAuthErrorMessage(err, 'Failed to place bid'))
    }
  }

  const handleCardClick = (e, auction) => {
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'BUTTON' ||
      e.target.closest('button') ||
      e.target.closest('input')
    ) {
      return
    }

    const detailedAuction = {
      ...auction,
      auctionId: auction.auctionId,
      auctionDate: auction.expiresAt
        ? new Date(auction.expiresAt).toLocaleDateString()
        : '—',
      deliveryCharge:
        auction.bidStartFrom != null ? `€${auction.bidStartFrom}` : '—',
      customer: {
        name: '—',
        phone: '—',
        email: '—',
        deliveryAddress: auction.deliveryLocation || '—',
      },
      product: {
        name: auction.title || '—',
        sku: '—',
        quantity: auction.quantity || '—',
        weight: '—',
        price: '—',
      },
      shipping: {
        pickupLocation: auction.pickupLocation || '—',
        unloadingInstructions: auction.deliveryLocation || '—',
        accessCondition: '—',
        additionalNotes: '—',
      },
    }
    setSelectedAuction(detailedAuction)
  }

  if (selectedAuction) {
    return (
      <AuctionDetails
        role="transporter"
        status={selectedAuction.status === 'ended' ? 'complete' : 'active'}
        auction={selectedAuction}
        onBack={() => setSelectedAuction(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('transporterAuctionBoard.title')}
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {t('transporterAuctionBoard.matchingCount', {
              count: filteredAuctions.length,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-sm font-medium text-gray-500">
            {t('transporterAuctionBoard.filter')}
          </span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
            aria-label={t('transporterAuctionBoard.filterAria')}
          >
            <option value="all">
              {t('transporterAuctionBoard.filters.all')}
            </option>
            <option value="endingSoon">
              {t('transporterAuctionBoard.filters.endingSoon')}
            </option>
            <option value="nearestFirst">
              {t('transporterAuctionBoard.filters.nearestFirst')}
            </option>
            <option value="ended">
              {t('transporterAuctionBoard.filters.ended')}
            </option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading auctions…</p>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load auctions')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {bidError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {bidError}
        </div>
      ) : null}

      {!isLoading && !isError && filteredAuctions.length === 0 ? (
        <p className="text-sm text-gray-500">No auctions found.</p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredAuctions.map((auction) => (
     
            <AuctionCard
              role="transporter"
              auction={auction}
              onPlaceBid={handlePlaceBid}
            />

        ))}
      </div>
    </div>
  )
}
